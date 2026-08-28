(function createMathTraceParser(globalScope) {
  "use strict";

  const yaml = globalScope.jsyaml;

  if (!yaml) {
    throw new Error("MathTrace could not start because the YAML reader was not loaded.");
  }

  function isRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function parseYaml(text, sourceName) {
    try {
      const parsed = yaml.load(text);

      if (!isRecord(parsed)) {
        throw new Error("the document must contain a YAML mapping at its top level");
      }

      return parsed;
    } catch (error) {
      const detail = error instanceof Error ? error.message : "invalid YAML";
      throw new Error(`${sourceName}: ${detail}`);
    }
  }

  function requiredString(value, field, sourceName) {
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(`${sourceName}: ${field} must be a nonempty string.`);
    }

    return value.trim();
  }

  function optionalStringArray(value, field, sourceName) {
    if (value === undefined || value === null) {
      return [];
    }

    if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item.trim() === "")) {
      throw new Error(`${sourceName}: ${field} must be a list of nonempty strings.`);
    }

    return value.map((item) => item.trim());
  }

  function requiredStringArray(value, field, sourceName) {
    if (value === undefined || value === null) {
      throw new Error(`${sourceName}: ${field} must be present as a list, even when empty.`);
    }

    return optionalStringArray(value, field, sourceName);
  }

  function optionalString(value, field, sourceName) {
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(`${sourceName}: ${field} must be a nonempty string when provided.`);
    }

    return value.trim();
  }

  function parseAuthor(value, index, sourceName) {
    const authorSource = `${sourceName}: authors[${index}]`;

    if (typeof value === "string") {
      return {
        name: requiredString(value, "name", authorSource),
        arxiv: null,
      };
    }

    if (!isRecord(value)) {
      throw new Error(`${authorSource} must be a name or a mapping.`);
    }

    const arxiv = optionalString(value.arxiv, "arxiv", authorSource);

    if (arxiv) {
      let url;

      try {
        url = new URL(arxiv);
      } catch {
        throw new Error(`${authorSource}: arxiv must be a complete HTTPS arXiv URL.`);
      }

      if (url.protocol !== "https:" || url.hostname !== "arxiv.org") {
        throw new Error(`${authorSource}: arxiv must be a complete HTTPS URL on arxiv.org.`);
      }
    }

    return {
      name: requiredString(value.name, "name", authorSource),
      arxiv,
    };
  }

  function splitFrontmatter(text, sourceName) {
    const normalized = text.replace(/\r\n?/g, "\n");
    const match = normalized.match(/^---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)/);

    if (!match) {
      throw new Error(`${sourceName}: file must begin with YAML frontmatter enclosed by --- lines.`);
    }

    return {
      frontmatter: match[1],
      body: normalized.slice(match[0].length),
    };
  }

  function parseNode(nodeFile) {
    const sourceName = nodeFile.path;
    const parts = splitFrontmatter(nodeFile.text, sourceName);
    const metadata = parseYaml(parts.frontmatter, `${sourceName} frontmatter`);

    if (metadata.source !== undefined && !isRecord(metadata.source)) {
      throw new Error(`${sourceName}: source must be a mapping when provided.`);
    }

    const requires = requiredStringArray(metadata.requires, "requires", sourceName);

    if (new Set(requires).size !== requires.length) {
      throw new Error(`${sourceName}: requires contains a duplicate node ID.`);
    }

    return {
      id: requiredString(metadata.id, "id", sourceName),
      kind: requiredString(metadata.kind, "kind", sourceName),
      title: requiredString(metadata.title, "title", sourceName),
      requires,
      source: metadata.source || null,
      path: sourceName,
      body: parts.body,
      metadata,
    };
  }

  function parsePaper(paperFile) {
    const sourceName = paperFile.path || "mathtrace.paper.md";
    const parts = splitFrontmatter(paperFile.text, sourceName);
    const metadata = parseYaml(parts.frontmatter, `${sourceName} frontmatter`);

    const paperId = requiredString(metadata.id, "id", sourceName);

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(paperId)) {
      throw new Error(`${sourceName}: id must use lowercase letters, digits, and single hyphens only.`);
    }

    if (!Array.isArray(metadata.authors) || metadata.authors.length === 0) {
      throw new Error(`${sourceName}: authors must be a nonempty list.`);
    }

    return {
      id: paperId,
      title: requiredString(metadata.title, "title", sourceName),
      authors: metadata.authors.map((author, index) => parseAuthor(author, index, sourceName)),
      graph: { nodeDirectory: "nodes" },
      layout: {},
      bundling: {},
      path: sourceName,
      body: parts.body,
      metadata,
      isFallback: false,
    };
  }

  function findCycleNodes(nodes, edges) {
    const indegree = new Map(nodes.map((node) => [node.id, 0]));
    const dependents = new Map(nodes.map((node) => [node.id, []]));

    for (const edge of edges) {
      indegree.set(edge.target, indegree.get(edge.target) + 1);
      dependents.get(edge.source).push(edge.target);
    }

    const queue = nodes.filter((node) => indegree.get(node.id) === 0).map((node) => node.id);
    let visited = 0;

    while (queue.length > 0) {
      const nodeId = queue.shift();
      visited += 1;

      for (const dependentId of dependents.get(nodeId)) {
        const nextIndegree = indegree.get(dependentId) - 1;
        indegree.set(dependentId, nextIndegree);

        if (nextIndegree === 0) {
          queue.push(dependentId);
        }
      }
    }

    if (visited === nodes.length) {
      return [];
    }

    return nodes.filter((node) => indegree.get(node.id) > 0).map((node) => node.id);
  }

  function validateBundles(bundles, nodeById, rejectOverlappingBundles) {
    const claimedMembers = new Map();

    for (const bundle of bundles) {
      for (const memberId of bundle.members) {
        if (!nodeById.has(memberId)) {
          throw new Error(`Bundle ${bundle.id} refers to missing node ${memberId}.`);
        }

        if (rejectOverlappingBundles && claimedMembers.has(memberId)) {
          throw new Error(`Node ${memberId} belongs to both ${claimedMembers.get(memberId)} and ${bundle.id}.`);
        }

        claimedMembers.set(memberId, bundle.id);
      }

      if (!nodeById.has(bundle.representative)) {
        throw new Error(`Bundle ${bundle.id} has missing representative ${bundle.representative}.`);
      }

      if (!bundle.members.includes(bundle.representative)) {
        throw new Error(`Bundle ${bundle.id} must include its representative in members.`);
      }
    }
  }

  function buildGraph(nodeFiles, configuration) {
    const nodes = nodeFiles.map(parseNode);
    const nodeById = new Map();

    for (const node of nodes) {
      if (nodeById.has(node.id)) {
        throw new Error(`Duplicate node ID ${node.id} appears in ${nodeById.get(node.id).path} and ${node.path}.`);
      }

      nodeById.set(node.id, node);
    }

    const edges = [];

    for (const node of nodes) {
      for (const dependencyId of node.requires) {
        if (!nodeById.has(dependencyId)) {
          throw new Error(`${node.path}: requires missing node ${dependencyId}.`);
        }

        if (dependencyId === node.id) {
          throw new Error(`${node.path}: a node cannot require itself.`);
        }

        edges.push({
          id: `edge.${edges.length}`,
          source: dependencyId,
          target: node.id,
        });
      }
    }

    const cycleNodes = findCycleNodes(nodes, edges);

    if (cycleNodes.length > 0) {
      throw new Error(`The dependency graph contains a cycle involving: ${cycleNodes.join(", ")}.`);
    }

    validateBundles(
      configuration.bundles,
      nodeById,
      configuration.bundling.rejectOverlappingBundles === true,
    );

    return {
      nodes,
      edges,
      nodeById,
      bundles: configuration.bundles,
      layout: configuration.layout,
      bundling: configuration.bundling,
      roots: nodes.filter((node) => node.requires.length === 0).map((node) => node.id),
    };
  }

  globalScope.MathTraceParser = Object.freeze({
    buildGraph,
    parseNode,
    parsePaper,
  });
}(globalThis));
