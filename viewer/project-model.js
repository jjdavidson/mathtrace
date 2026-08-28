(function createMathTraceProjectModel(globalScope) {
  "use strict";

  const parser = globalScope.MathTraceParser;

  if (!parser) {
    throw new Error("MathTrace could not start because the paper parser was not loaded.");
  }

  function runtimeId() {
    if (globalScope.crypto?.randomUUID) {
      return globalScope.crypto.randomUUID();
    }

    return `project-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function cloneBundles(bundles) {
    return bundles.map((bundle) => ({
      ...bundle,
      members: [...bundle.members],
    }));
  }

  function cloneDemoFile(file) {
    return {
      ...file,
      bytes: file.bytes instanceof Uint8Array
        ? new Uint8Array(file.bytes)
        : new Uint8Array(file.bytes || []),
    };
  }

  function isNativeNodeId(paperId, nodeId) {
    return nodeId.startsWith(`${paperId}.`);
  }

  function paperGraphNodeId(project) {
    return `paper:${project.instanceId}`;
  }

  function buildPaperDependencyGraph(projects) {
    const nodes = projects.map((project) => ({
      id: paperGraphNodeId(project),
      kind: "paper",
      title: project.paper.title,
      memberCount: project.graph.nodes.length,
      importedCount: project.graph.nodes.filter(
        (node) => !isNativeNodeId(project.paper.id, node.id),
      ).length,
      requires: [],
      paperId: project.paper.id,
      paper: project.paper,
      projectInstanceId: project.instanceId,
    }));
    const edges = [];
    const projectsByPaperId = new Map();

    for (const project of projects) {
      const matches = projectsByPaperId.get(project.paper.id) || [];
      matches.push(project);
      projectsByPaperId.set(project.paper.id, matches);
    }

    for (const consumer of projects) {
      const importedByProvider = new Map();

      for (const node of consumer.graph.nodes) {
        if (isNativeNodeId(consumer.paper.id, node.id)) {
          continue;
        }

        const sourcePaperId = node.id.split(".", 1)[0];

        for (const provider of projectsByPaperId.get(sourcePaperId) || []) {
          if (
            provider.instanceId === consumer.instanceId
            || !provider.graph.nodeById.has(node.id)
            || !isNativeNodeId(provider.paper.id, node.id)
          ) {
            continue;
          }

          const importedNodeIds = importedByProvider.get(provider.instanceId) || new Set();
          importedNodeIds.add(node.id);
          importedByProvider.set(provider.instanceId, importedNodeIds);
        }
      }

      for (const [providerInstanceId, importedNodeIds] of importedByProvider) {
        edges.push({
          id: `paper-edge:${providerInstanceId}:${consumer.instanceId}`,
          source: `paper:${providerInstanceId}`,
          target: paperGraphNodeId(consumer),
          importedNodeIds: Array.from(importedNodeIds).sort(),
        });
      }
    }

    return {
      nodes,
      nodeById: new Map(nodes.map((node) => [node.id, node])),
      edges,
      bundles: [],
      layout: {
        algorithm: "layered",
        direction: "DOWN",
        nodePlacementStrategy: "NETWORK_SIMPLEX",
      },
      bundling: {
        removeInternalEdges: true,
        deduplicateExternalEdges: true,
        rejectCyclesAfterBundling: false,
      },
    };
  }

  function paperDependencyGraphSignature(graph) {
    const nodes = (graph?.nodes || [])
      .map((node) => node.id)
      .sort();
    const edges = (graph?.edges || [])
      .map((edge) => ({
        source: edge.source,
        target: edge.target,
        importedNodeIds: [...(edge.importedNodeIds || [])].sort(),
      }))
      .sort((first, second) => (
        `${first.source}\u0000${first.target}`.localeCompare(`${second.source}\u0000${second.target}`)
      ));

    return JSON.stringify({ nodes, edges });
  }

  function createProject({
    sourceKind,
    sourceName,
    paper,
    paperFile = null,
    configuration,
    nodeFiles,
    demoFiles = [],
    graph,
    sourceFile = null,
    diagnostics = [],
  }) {
    if (!paper?.id || !paper?.title) {
      throw new Error("A MathTrace project requires normalized paper metadata.");
    }

    const defaultBundles = [];
    const workingBundles = [];
    const workingConfiguration = {
      ...configuration,
      bundles: workingBundles,
    };
    const workingGraph = {
      ...graph,
      bundles: workingBundles,
    };

    return {
      format: "mathtrace-project",
      version: 1,
      instanceId: runtimeId(),
      viewMode: "workspace",
      graphReaderMode: "overview",
      paperId: paper.id,
      title: paper.title,
      source: {
        kind: sourceKind,
        name: sourceName,
      },
      paper,
      configuration: workingConfiguration,
      nodeFiles: nodeFiles.map((file) => ({ ...file })),
      demoFiles: demoFiles.map(cloneDemoFile),
      graph: workingGraph,
      files: {
        source: sourceFile ? { ...sourceFile } : null,
        paper: paperFile ? { ...paperFile } : null,
        nodes: nodeFiles.map((file) => ({ ...file })),
        demos: demoFiles.map(cloneDemoFile),
      },
      defaults: {
        paperText: paperFile?.text || "",
        nodeFiles: nodeFiles.map((file) => ({ ...file })),
        demoFiles: demoFiles.map(cloneDemoFile),
        bundles: defaultBundles,
      },
      working: {
        bundles: workingBundles,
      },
      diagnostics: diagnostics.map((diagnostic) => ({ ...diagnostic })),
    };
  }

  function fromNativeFolder({ folderName, paperFile, nodeFiles, demoFiles = [] }) {
    if (!paperFile) {
      throw new Error("A MathTrace folder requires mathtrace.paper.md at its top level.");
    }

    const paper = parser.parsePaper(paperFile);
    const configuration = {
      graph: paper.graph,
      layout: paper.layout,
      bundling: paper.bundling,
      bundles: [],
    };
    const graph = parser.buildGraph(nodeFiles, configuration);

    return createProject({
      sourceKind: "native-folder",
      sourceName: folderName,
      paper,
      paperFile,
      configuration,
      nodeFiles,
      demoFiles,
      graph,
    });
  }

  globalScope.MathTraceProjectModel = Object.freeze({
    buildPaperDependencyGraph,
    createProject,
    fromNativeFolder,
    paperDependencyGraphSignature,
  });
}(globalThis));
