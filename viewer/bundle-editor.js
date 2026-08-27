(function createMathTraceBundleEditor(globalScope) {
  "use strict";

  const parser = globalScope.MathTraceParser;
  const graphView = globalScope.MathTraceGraphView;

  if (!parser || !graphView) {
    throw new Error("MathTrace could not start because the bundle editor dependencies were not loaded.");
  }

  function cloneBundles(bundles) {
    return bundles.map((bundle) => ({
      id: bundle.id,
      title: bundle.title,
      representative: bundle.representative,
      collapsed: bundle.collapsed,
      members: [...bundle.members],
    }));
  }

  function canonicalBundle(bundle) {
    const members = Array.from(new Set(bundle.members || []));

    return {
      id: String(bundle.id || "").trim(),
      title: String(bundle.title || "").trim(),
      representative: String(bundle.representative || "").trim(),
      collapsed: bundle.collapsed !== false,
      members,
    };
  }

  function normalizedBundleJson(bundle) {
    return JSON.stringify(canonicalBundle(bundle));
  }

  function chooseRepresentative(project, members, preferredId = null) {
    const memberIds = Array.from(new Set(members || []));
    const memberSet = new Set(memberIds);

    if (preferredId && memberSet.has(preferredId)) {
      return preferredId;
    }

    if (memberIds.length === 0) {
      return "";
    }

    const graphOrder = new Map(project.graph.nodes.map((node, index) => [node.id, index]));
    const internalOutgoing = new Map(memberIds.map((nodeId) => [nodeId, 0]));
    const internalIncoming = new Map(memberIds.map((nodeId) => [nodeId, 0]));
    const externalOutgoing = new Map(memberIds.map((nodeId) => [nodeId, 0]));

    for (const edge of project.graph.edges) {
      if (memberSet.has(edge.source) && memberSet.has(edge.target)) {
        internalOutgoing.set(edge.source, internalOutgoing.get(edge.source) + 1);
        internalIncoming.set(edge.target, internalIncoming.get(edge.target) + 1);
      } else if (memberSet.has(edge.source)) {
        externalOutgoing.set(edge.source, externalOutgoing.get(edge.source) + 1);
      }
    }

    const sinks = memberIds.filter((nodeId) => internalOutgoing.get(nodeId) === 0);
    const candidates = sinks.length > 0 ? sinks : memberIds;
    candidates.sort((first, second) => (
      externalOutgoing.get(second) - externalOutgoing.get(first)
      || internalIncoming.get(second) - internalIncoming.get(first)
      || graphOrder.get(second) - graphOrder.get(first)
      || first.localeCompare(second)
    ));
    return candidates[0];
  }

  function validateBundleDraft(
    project,
    bundle,
    editingBundleId = null,
    ignoredBundleIds = [],
  ) {
    const candidate = canonicalBundle(bundle);
    const ignoredIds = new Set(ignoredBundleIds);

    if (!/^bundle\.[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(candidate.id)) {
      throw new Error("The bundle ID must start with bundle. and use lowercase letters, numbers, dots, or hyphens.");
    }

    if (!candidate.title) {
      throw new Error("Enter a title for the bundle.");
    }

    if (candidate.members.length < 2) {
      throw new Error("A bundle must contain at least two nodes.");
    }

    if (!candidate.members.includes(candidate.representative)) {
      throw new Error("Choose one of the selected nodes as the representative.");
    }

    const existingId = project.working.bundles.find((existing) => (
      existing.id === candidate.id
      && existing.id !== editingBundleId
      && !ignoredIds.has(existing.id)
    ));

    if (existingId) {
      throw new Error(`A bundle with the ID ${candidate.id} already exists.`);
    }

    const claimedMembers = new Map();

    for (const existing of project.working.bundles) {
      if (existing.id === editingBundleId || ignoredIds.has(existing.id)) {
        continue;
      }

      for (const memberId of existing.members) {
        claimedMembers.set(memberId, existing.title);
      }
    }

    const overlap = candidate.members.find((memberId) => claimedMembers.has(memberId));

    if (overlap) {
      throw new Error(`${project.graph.nodeById.get(overlap)?.title || overlap} already belongs to ${claimedMembers.get(overlap)}.`);
    }

    return candidate;
  }

  function buildCandidateGraph(project, bundles) {
    const configuration = {
      ...project.configuration,
      bundles: cloneBundles(bundles),
    };
    const graph = parser.buildGraph(project.nodeFiles, configuration);
    graphView.buildVisibleGraph(graph);
    return { graph, configuration };
  }

  function applyBundles(project, bundles) {
    const workingBundles = cloneBundles(bundles);
    const candidate = buildCandidateGraph(project, workingBundles);
    project.working.bundles = workingBundles;
    project.configuration = {
      ...candidate.configuration,
      bundles: workingBundles,
    };
    project.graph = {
      ...candidate.graph,
      bundles: workingBundles,
    };
    return project.graph;
  }

  function saveBundle(project, bundle, editingBundleId = null) {
    const editingBundle = editingBundleId
      ? project.working.bundles.find((existing) => existing.id === editingBundleId)
      : null;
    const absorbedBundleIds = Array.from(new Set(
      (bundle.absorbedBundleIds || []).map((bundleId) => String(bundleId).trim()),
    )).filter(Boolean);
    const absorbedIdSet = new Set(absorbedBundleIds);

    if (editingBundleId && absorbedIdSet.has(editingBundleId)) {
      throw new Error("A bundle cannot absorb itself.");
    }

    const absorbedBundles = absorbedBundleIds.map((bundleId) => {
      const absorbedBundle = project.working.bundles.find((existing) => existing.id === bundleId);

      if (!absorbedBundle) {
        throw new Error(`The bundle ${bundleId} is no longer available.`);
      }

      return absorbedBundle;
    });
    const combinedMembers = Array.from(new Set([
      ...(bundle.members || []),
      ...absorbedBundles.flatMap((absorbedBundle) => absorbedBundle.members),
    ]));
    const candidate = validateBundleDraft(project, {
      ...bundle,
      members: combinedMembers,
      representative: chooseRepresentative(
        project,
        combinedMembers,
        editingBundle?.representative || null,
      ),
    }, editingBundleId, absorbedBundleIds);
    const bundles = cloneBundles(project.working.bundles)
      .filter((existing) => !absorbedIdSet.has(existing.id));
    const editingIndex = editingBundleId
      ? bundles.findIndex((existing) => existing.id === editingBundleId)
      : -1;

    if (editingBundleId && editingIndex < 0) {
      throw new Error(`The bundle ${editingBundleId} is no longer available.`);
    }

    if (editingIndex >= 0) {
      bundles.splice(editingIndex, 1, candidate);
    } else {
      bundles.push(candidate);
    }

    applyBundles(project, bundles);
    return candidate;
  }

  function deleteBundle(project, bundleId) {
    const bundle = project.working.bundles.find((candidate) => candidate.id === bundleId);

    if (!bundle) {
      throw new Error(`The bundle ${bundleId} is no longer available.`);
    }

    applyBundles(project, project.working.bundles.filter((candidate) => candidate.id !== bundleId));
    return { ...bundle, members: [...bundle.members] };
  }

  function restoreDefaults(project) {
    applyBundles(project, project.defaults.bundles);
    return cloneBundles(project.working.bundles);
  }

  function hasChanges(project) {
    return JSON.stringify(cloneBundles(project.working.bundles))
      !== JSON.stringify(cloneBundles(project.defaults.bundles));
  }

  function bundleStatus(project, bundle) {
    const original = project.defaults.bundles.find((candidate) => candidate.id === bundle.id);

    if (!original) {
      return "custom";
    }

    return normalizedBundleJson(original) === normalizedBundleJson(bundle)
      ? "default"
      : "edited";
  }

  globalScope.MathTraceBundleEditor = Object.freeze({
    applyBundles,
    bundleStatus,
    chooseRepresentative,
    cloneBundles,
    deleteBundle,
    hasChanges,
    restoreDefaults,
    saveBundle,
    validateBundleDraft,
  });
}(globalThis));
