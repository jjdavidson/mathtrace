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
      viewMode: "card",
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
    createProject,
    fromNativeFolder,
  });
}(globalThis));
