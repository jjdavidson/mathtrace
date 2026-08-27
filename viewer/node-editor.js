(function createMathTraceNodeEditor(globalScope) {
  "use strict";

  const parser = globalScope.MathTraceParser;
  const yaml = globalScope.jsyaml;
  const bundleEditor = globalScope.MathTraceBundleEditor;
  const NODE_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;

  if (!parser || !yaml || !bundleEditor) {
    throw new Error("MathTrace could not start because the node editor dependencies were not loaded.");
  }

  function cloneBundles(bundles) {
    return bundles.map((bundle) => ({
      ...bundle,
      members: [...bundle.members],
    }));
  }

  function splitFrontmatter(text, sourceName = "node.md") {
    const normalized = String(text || "").replace(/\r\n?/g, "\n");
    const match = normalized.match(/^---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)/);

    if (!match) {
      throw new Error(`${sourceName}: file must begin with YAML frontmatter enclosed by --- lines.`);
    }

    return {
      frontmatter: match[1],
      body: normalized.slice(match[0].length),
    };
  }

  function dumpYaml(value) {
    return yaml.dump(JSON.parse(JSON.stringify(value)), {
      indent: 2,
      lineWidth: -1,
      noCompatMode: true,
      noRefs: true,
      sortKeys: false,
    }).trimEnd();
  }

  function serializeNode(metadata, body) {
    return `---\n${dumpYaml(metadata)}\n---\n\n${String(body || "").replace(/^\n+/, "")}`;
  }

  function safeFileStem(value) {
    return value
      .replace(/[^A-Za-z0-9._-]+/g, "-")
      .replace(/^[.-]+|[.-]+$/g, "") || "node";
  }

  function pathForNewNode(project, nodeId) {
    const directory = project.configuration.graph.nodeDirectory;
    return `${directory}/newly-added/${safeFileStem(nodeId)}.md`;
  }

  function uniqueSuggestedId(project) {
    const namespace = String(project.paperId || "paper")
      .replace(/\.paper$/i, "")
      .replace(/[^A-Za-z0-9._:-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "paper";
    const base = `${namespace}.new-node`;
    let candidate = base;
    let suffix = 2;

    while (project.graph.nodeById.has(candidate)) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }

    return candidate;
  }

  function createTemplate(project) {
    const id = uniqueSuggestedId(project);
    return {
      id,
      path: pathForNewNode(project, id),
      text: `---\nid: ${id}\ntitle: New node\nkind: definition\nrequires: []\n---\n\nWrite the node content here.\n`,
    };
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function isEscaped(source, index) {
    let slashCount = 0;

    for (let cursor = index - 1; cursor >= 0 && source[cursor] === "\\"; cursor -= 1) {
      slashCount += 1;
    }

    return slashCount % 2 === 1;
  }

  function findMathDelimiter(source, index) {
    const delimiters = [
      { open: "$$", close: "$$" },
      { open: "\\[", close: "\\]" },
      { open: "\\(", close: "\\)" },
      { open: "$", close: "$" },
    ];

    return delimiters.find(({ open }) => (
      source.startsWith(open, index) && !isEscaped(source, index)
    )) || null;
  }

  function findClosingMathDelimiter(source, delimiter, startIndex) {
    for (let index = startIndex; index < source.length; index += 1) {
      if (source.startsWith(delimiter, index) && !isEscaped(source, index)) {
        return index;
      }
    }

    return -1;
  }

  function highlightMathSource(text) {
    const source = String(text || "");
    const segments = [];
    let plainStart = 0;
    let cursor = 0;

    while (cursor < source.length) {
      const delimiter = findMathDelimiter(source, cursor);

      if (!delimiter) {
        cursor += 1;
        continue;
      }

      const contentStart = cursor + delimiter.open.length;
      const closingIndex = findClosingMathDelimiter(source, delimiter.close, contentStart);

      if (closingIndex === -1) {
        cursor = contentStart;
        continue;
      }

      segments.push(escapeHtml(source.slice(plainStart, cursor)));
      const mathEnd = closingIndex + delimiter.close.length;
      segments.push(
        `<span class="node-source-math">${escapeHtml(source.slice(cursor, mathEnd))}</span>`,
      );
      cursor = mathEnd;
      plainStart = cursor;
    }

    segments.push(escapeHtml(source.slice(plainStart)));
    segments.push('<span class="node-source-highlight-sentinel">&#8203;</span>');
    return segments.join("");
  }

  function escapePattern(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function replaceWikiReferences(text, oldId, newId) {
    const pattern = new RegExp(`(\\[\\[\\s*)${escapePattern(oldId)}(?=\\s*(?:\\||\\]\\]))`, "g");
    return String(text || "").replace(pattern, `$1${newId}`);
  }

  function deletedWikiReferencePattern(nodeId) {
    return new RegExp(
      `\\[\\[\\s*${escapePattern(nodeId)}(?:\\s*\\|[^\\]]*)?\\s*\\]\\]`,
      "g",
    );
  }

  function replaceDeletedWikiReferences(text, nodeId) {
    let replacements = 0;
    const value = String(text || "").replace(deletedWikiReferencePattern(nodeId), () => {
      replacements += 1;
      return "[[deleted reference]]";
    });
    return { value, replacements };
  }

  function rewriteNodeForDeletion(file, nodeId) {
    const parsed = parser.parseNode(file);
    const parts = splitFrontmatter(file.text, file.path);
    const metadata = JSON.parse(JSON.stringify(parsed.metadata));
    const nextRequires = parsed.requires.filter((dependencyId) => dependencyId !== nodeId);
    const bodyResult = replaceDeletedWikiReferences(parts.body, nodeId);
    const dependencyRemoved = nextRequires.length !== parsed.requires.length;

    if (!dependencyRemoved && bodyResult.replacements === 0) {
      return {
        file: { ...file },
        dependencyRemoved,
        wikiReplacements: 0,
      };
    }

    metadata.requires = nextRequires;
    return {
      file: {
        ...file,
        text: serializeNode(metadata, bodyResult.value),
      },
      dependencyRemoved,
      wikiReplacements: bodyResult.replacements,
    };
  }

  function repairBundlesForDeletion(project, bundles, nodeId) {
    const changedBundleIds = [];
    const dissolvedBundleIds = [];
    const repairedBundles = [];

    for (const bundle of cloneBundles(bundles)) {
      if (!bundle.members.includes(nodeId)) {
        repairedBundles.push(bundle);
        continue;
      }

      const members = bundle.members.filter((memberId) => memberId !== nodeId);

      if (members.length < 2) {
        dissolvedBundleIds.push(bundle.id);
        continue;
      }

      changedBundleIds.push(bundle.id);
      repairedBundles.push({
        ...bundle,
        members,
        representative: bundle.representative === nodeId
          ? bundleEditor.chooseRepresentative(project, members)
          : bundle.representative,
      });
    }

    return { bundles: repairedBundles, changedBundleIds, dissolvedBundleIds };
  }

  function analyzeDeletion(project, nodeId) {
    const node = project?.graph?.nodeById?.get(nodeId);

    if (!node) {
      throw new Error(`The node ${nodeId} is no longer available.`);
    }

    const dependents = project.graph.nodes
      .filter((candidate) => candidate.requires.includes(nodeId))
      .map((candidate) => ({
        id: candidate.id,
        title: candidate.title,
        path: candidate.path,
      }));
    const wikiReferenceNodes = [];

    for (const file of project.nodeFiles) {
      if (file.path === node.path) {
        continue;
      }

      const parts = splitFrontmatter(file.text, file.path);
      const matches = parts.body.match(deletedWikiReferencePattern(nodeId));

      if (matches?.length) {
        const referencedBy = project.graph.nodes.find((candidate) => candidate.path === file.path);
        wikiReferenceNodes.push({
          id: referencedBy?.id || file.path,
          title: referencedBy?.title || file.path,
          path: file.path,
          count: matches.length,
        });
      }
    }

    const bundles = project.working.bundles
      .filter((bundle) => bundle.members.includes(nodeId))
      .map((bundle) => ({ id: bundle.id, title: bundle.title }));

    return {
      node: { id: node.id, title: node.title, path: node.path },
      dependents,
      wikiReferenceNodes,
      bundles,
    };
  }

  function deleteNode(project, nodeId) {
    const impact = analyzeDeletion(project, nodeId);
    const rewrites = project.nodeFiles
      .filter((file) => file.path !== impact.node.path)
      .map((file) => rewriteNodeForDeletion(file, nodeId));
    const candidateFiles = rewrites
      .map((rewrite) => rewrite.file)
      .sort((first, second) => first.path.localeCompare(second.path));
    const workingRepair = repairBundlesForDeletion(project, project.working.bundles, nodeId);
    const defaultRepair = repairBundlesForDeletion(project, project.defaults.bundles, nodeId);
    const candidateConfiguration = {
      ...project.configuration,
      bundles: workingRepair.bundles,
    };
    const candidateGraph = parser.buildGraph(candidateFiles, candidateConfiguration);
    const paperBodyResult = replaceDeletedWikiReferences(project.paper.body, nodeId);
    const paperFileResult = project.files.paper?.text
      ? replaceDeletedWikiReferences(project.files.paper.text, nodeId)
      : null;

    project.nodeFiles = candidateFiles;
    project.files.nodes = candidateFiles.map((file) => ({ ...file }));
    project.working.bundles = workingRepair.bundles;
    project.defaults.bundles = defaultRepair.bundles;
    project.configuration = candidateConfiguration;
    project.graph = {
      ...candidateGraph,
      bundles: workingRepair.bundles,
    };
    project.paper.body = paperBodyResult.value;

    if (paperFileResult) {
      project.files.paper.text = paperFileResult.value;
    }

    return {
      ...impact,
      dependentFilesChanged: rewrites.filter((rewrite) => rewrite.dependencyRemoved).length,
      wikiReplacements: rewrites.reduce((total, rewrite) => total + rewrite.wikiReplacements, 0)
        + paperBodyResult.replacements,
      changedBundleIds: workingRepair.changedBundleIds,
      dissolvedBundleIds: workingRepair.dissolvedBundleIds,
    };
  }

  function replaceNodeReferences(file, oldId, newId) {
    const parsed = parser.parseNode(file);
    const parts = splitFrontmatter(file.text, file.path);
    const metadata = JSON.parse(JSON.stringify(parsed.metadata));
    const nextRequires = Array.from(new Set(parsed.requires.map((dependencyId) => (
      dependencyId === oldId ? newId : dependencyId
    ))));
    const nextBody = replaceWikiReferences(parts.body, oldId, newId);
    const requiresChanged = nextRequires.length !== parsed.requires.length
      || nextRequires.some((dependencyId, index) => dependencyId !== parsed.requires[index]);
    const bodyChanged = nextBody !== parts.body;

    if (!requiresChanged && !bodyChanged) {
      return file;
    }

    metadata.requires = nextRequires;
    return {
      ...file,
      text: serializeNode(metadata, nextBody),
    };
  }

  function replaceBundleReferences(bundles, oldId, newId) {
    return cloneBundles(bundles).map((bundle) => ({
      ...bundle,
      representative: bundle.representative === oldId ? newId : bundle.representative,
      members: bundle.members.map((memberId) => memberId === oldId ? newId : memberId),
    }));
  }

  function metadataChanged(previous, next) {
    return JSON.stringify(previous) !== JSON.stringify(next);
  }

  function updatePaperLinks(project, oldId, newId) {
    project.paper.body = replaceWikiReferences(project.paper.body, oldId, newId);

    if (project.files.paper?.text) {
      project.files.paper.text = replaceWikiReferences(project.files.paper.text, oldId, newId);
    }
  }

  function applyNodeSource(project, {
    mode,
    originalNodeId = null,
    text,
  }) {
    if (!project || !["create", "edit"].includes(mode)) {
      throw new Error("The node editor does not have a valid project or mode.");
    }

    const originalNode = mode === "edit"
      ? project.graph.nodeById.get(originalNodeId)
      : null;

    if (mode === "edit" && !originalNode) {
      throw new Error(`The node ${originalNodeId} is no longer available.`);
    }

    const originalFile = originalNode
      ? project.nodeFiles.find((file) => file.path === originalNode.path)
      : null;

    if (mode === "edit" && !originalFile) {
      throw new Error(`The source file for ${originalNodeId} is no longer available.`);
    }

    const provisionalPath = originalFile?.path || `${project.configuration.graph.nodeDirectory}/new-node.md`;
    const parsedDraft = parser.parseNode({ path: provisionalPath, text });

    if (!NODE_ID_PATTERN.test(parsedDraft.id)) {
      throw new Error("The node ID must start with a letter or number and use only letters, numbers, dots, underscores, colons, or hyphens.");
    }

    const renamed = Boolean(originalNode && originalNode.id !== parsedDraft.id);
    const destinationPath = mode === "create"
      ? pathForNewNode(project, parsedDraft.id)
      : originalFile.path;
    const occupiedPath = project.nodeFiles.find((file) => (
      file.path === destinationPath && file.path !== originalFile?.path
    ));

    if (occupiedPath) {
      throw new Error(`${destinationPath} already exists. Choose a different node ID.`);
    }

    let candidateFiles = project.nodeFiles.map((file) => ({ ...file }));
    const candidateFile = {
      ...(originalFile || {}),
      path: destinationPath,
      text: String(text || "").replace(/\r\n?/g, "\n"),
    };

    if (mode === "create") {
      candidateFiles.push(candidateFile);
    } else {
      candidateFiles = candidateFiles.map((file) => (
        file.path === originalFile.path ? candidateFile : file
      ));
    }

    let candidateBundles = cloneBundles(project.working.bundles);
    let candidateDefaultBundles = cloneBundles(project.defaults.bundles);

    if (renamed) {
      candidateFiles = candidateFiles.map((file) => (
        replaceNodeReferences(file, originalNode.id, parsedDraft.id)
      ));
      candidateBundles = replaceBundleReferences(candidateBundles, originalNode.id, parsedDraft.id);
      candidateDefaultBundles = replaceBundleReferences(candidateDefaultBundles, originalNode.id, parsedDraft.id);
    }

    candidateFiles.sort((first, second) => first.path.localeCompare(second.path));
    const candidateConfiguration = {
      ...project.configuration,
      bundles: candidateBundles,
    };
    const candidateGraph = parser.buildGraph(candidateFiles, candidateConfiguration);
    const savedNode = candidateGraph.nodeById.get(parsedDraft.id);
    const frontmatterChanged = mode === "create" || metadataChanged(
      originalNode?.metadata || {},
      savedNode.metadata,
    );

    project.nodeFiles = candidateFiles;
    project.files.nodes = candidateFiles.map((file) => ({ ...file }));

    if (frontmatterChanged) {
      project.working.bundles = candidateBundles;
      project.configuration = candidateConfiguration;
      project.graph = {
        ...candidateGraph,
        bundles: candidateBundles,
      };
      project.defaults.bundles = candidateDefaultBundles;
    } else {
      const currentNode = project.graph.nodeById.get(savedNode.id);
      Object.assign(currentNode, savedNode);
    }

    if (renamed) {
      updatePaperLinks(project, originalNode.id, savedNode.id);
    }

    return {
      created: mode === "create",
      frontmatterChanged,
      graphChanged: frontmatterChanged,
      node: project.graph.nodeById.get(savedNode.id),
      oldId: originalNode?.id || null,
      path: destinationPath,
      renamed,
    };
  }

  globalScope.MathTraceNodeEditor = Object.freeze({
    analyzeDeletion,
    applyNodeSource,
    createTemplate,
    deleteNode,
    highlightMathSource,
    pathForNewNode,
    splitFrontmatter,
  });
}(globalThis));
