const paperDialog = document.querySelector("#paper-dialog");
const workspace = document.querySelector(".workspace");
const contentPanel = document.querySelector("#content-panel");
const toggleContentPanelButton = document.querySelector("#toggle-content-panel");
const openPaperDialogButton = document.querySelector("#open-paper-dialog");
const openDocumentationButton = document.querySelector("#open-documentation");
const closeDocumentationButton = document.querySelector("#close-documentation");
const documentationPanel = document.querySelector("#documentation-panel");
const documentationHeading = document.querySelector("#documentation-heading");
const closePaperDialogButton = document.querySelector("#close-paper-dialog");
const openMathTraceFolderButton = document.querySelector("#open-mathtrace-folder");
const paperFolderInput = document.querySelector("#paper-folder-input");
const dialogStatus = document.querySelector("#dialog-status");
const graphHeading = document.querySelector("#graph-heading");
const graphStatusTitle = document.querySelector("#graph-status-title");
const graphStatusDescription = document.querySelector("#graph-status-description");
const graphSurface = document.querySelector("#graph-surface");
const graphPanel = document.querySelector(".graph-panel");
const graphEmptyState = document.querySelector("#graph-empty-state");
const dependencyGraph = document.querySelector("#dependency-graph");
const graphViewport = document.querySelector("#graph-viewport");
const graphToolbar = document.querySelector("#graph-toolbar");
const bundleMenu = document.querySelector("#bundle-menu");
const bundleMenuButton = document.querySelector("#bundle-menu-button");
const bundleMenuCount = document.querySelector("#bundle-menu-count");
const bundleMenuPopover = document.querySelector("#bundle-menu-popover");
const bundleMenuList = document.querySelector("#bundle-menu-list");
const bundleMenuDescription = document.querySelector("#bundle-menu-description");
const createBundleButton = document.querySelector("#create-bundle");
const bundleEditorDialog = document.querySelector("#bundle-editor-dialog");
const bundleEditorForm = document.querySelector("#bundle-editor-form");
const bundleEditorTitle = document.querySelector("#bundle-editor-title");
const closeBundleEditorButton = document.querySelector("#close-bundle-editor");
const cancelBundleEditorButton = document.querySelector("#cancel-bundle-editor");
const bundleTitleInput = document.querySelector("#bundle-title");
const bundleIdInput = document.querySelector("#bundle-id");
const bundleCollapsedInput = document.querySelector("#bundle-collapsed");
const bundleNodeFilter = document.querySelector("#bundle-node-filter");
const bundleNodeList = document.querySelector("#bundle-node-list");
const bundleAbsorbSection = document.querySelector("#bundle-absorb-section");
const bundleAbsorbList = document.querySelector("#bundle-absorb-list");
const bundleSelectedCount = document.querySelector("#bundle-selected-count");
const bundleEditorStatus = document.querySelector("#bundle-editor-status");
const deleteBundleButton = document.querySelector("#delete-bundle");
const saveBundleButton = document.querySelector("#save-bundle");
const createNodeButton = document.querySelector("#create-node");
const expandNodeButton = document.querySelector("#expand-node");
const editNodeButton = document.querySelector("#edit-node");
const deleteNodeButton = document.querySelector("#delete-node");
const closePaperButton = document.querySelector("#close-paper");
const nodeDeleteDialog = document.querySelector("#node-delete-dialog");
const nodeDeleteName = document.querySelector("#node-delete-name");
const nodeDeleteId = document.querySelector("#node-delete-id");
const nodeDeleteDependentSummary = document.querySelector("#node-delete-dependent-summary");
const nodeDeleteDependentList = document.querySelector("#node-delete-dependent-list");
const nodeDeleteWikilinkNote = document.querySelector("#node-delete-wikilink-note");
const nodeDeleteBundleNote = document.querySelector("#node-delete-bundle-note");
const nodeDeleteDraftNote = document.querySelector("#node-delete-draft-note");
const cancelNodeDeleteButton = document.querySelector("#cancel-node-delete");
const confirmNodeDeleteButton = document.querySelector("#confirm-node-delete");
const paperDeleteDialog = document.querySelector("#paper-delete-dialog");
const paperDeleteName = document.querySelector("#paper-delete-name");
const paperDeleteId = document.querySelector("#paper-delete-id");
const paperDeleteEditStatus = document.querySelector("#paper-delete-edit-status");
const cancelPaperDeleteButton = document.querySelector("#cancel-paper-delete");
const confirmPaperDeleteButton = document.querySelector("#confirm-paper-delete");
const contentHeading = document.querySelector("#content-heading");
const nodeReader = document.querySelector("#node-reader");
const readerStatusTitle = document.querySelector("#reader-status-title");
const readerStatusDescription = document.querySelector("#reader-status-description");
const nodeEditorView = document.querySelector("#node-editor-view");
const nodeEditorKicker = document.querySelector("#node-editor-kicker");
const nodeEditorTitle = document.querySelector("#node-editor-title");
const nodeEditorPath = document.querySelector("#node-editor-path");
const nodeEditorContext = document.querySelector("#node-editor-context");
const nodeSourceHighlight = document.querySelector("#node-source-highlight");
const nodeSourceEditor = document.querySelector("#node-source-editor");
const nodeEditorStatus = document.querySelector("#node-editor-status");
const cancelNodeEditButton = document.querySelector("#cancel-node-edit");
const saveNodeButton = document.querySelector("#save-node");
const linkedNodePreview = document.querySelector("#linked-node-preview");
const linkedNodeReader = document.querySelector("#linked-node-reader");
const closeLinkedNodePreviewButton = document.querySelector("#close-linked-node-preview");

const mathTraceState = {
  projects: [],
  activeProjectInstanceId: null,
  documentationOpen: false,
  nodeExpanded: false,
  bundleEditor: {
    editingBundleId: null,
    idManuallyEdited: false,
    absorbedBundleIds: new Set(),
  },
  nodeEditor: {
    mode: null,
    originalNodeId: null,
    originalText: "",
  },
  nodeDeletion: {
    nodeId: null,
  },
  paperDeletion: {
    projectInstanceId: null,
  },
  linkedPreview: {
    nodeId: null,
  },
  viewMode: "workspace",
  workspaceGraph: null,
  workspaceGraphViewState: null,
  workspaceGraphNeedsFit: false,
  paperGraph: null,
  currentGraph: null,
};

function openPaperDialog() {
  if (!nodeEditorView.hasAttribute("hidden") && !closeNodeEditor()) {
    return;
  }

  if (bundleEditorDialog.open) {
    closeBundleEditor();
  }

  if (nodeDeleteDialog.open) {
    closeNodeDeleteDialog({ restoreFocus: false });
  }

  closeLinkedNodePreview({ restoreFocus: false });

  if (mathTraceState.documentationOpen) {
    setDocumentationOpen(false, { restoreFocus: false });
  }

  if (!paperDialog.open) {
    showDialogStatus("");
    paperDialog.showModal();
  }
}

function closePaperDialog() {
  paperDialog.close();
}

function setDocumentationOpen(isOpen, { restoreFocus = true } = {}) {
  if (isOpen && !nodeEditorView.hasAttribute("hidden") && !closeNodeEditor()) {
    return;
  }

  if (isOpen && bundleEditorDialog.open) {
    closeBundleEditor();
  }

  if (isOpen && nodeDeleteDialog.open) {
    closeNodeDeleteDialog({ restoreFocus: false });
  }

  if (isOpen) {
    closeLinkedNodePreview({ restoreFocus: false });
  }

  mathTraceState.documentationOpen = isOpen;
  workspace.classList.toggle("is-documentation-open", isOpen);
  documentationPanel.toggleAttribute("hidden", !isOpen);
  openDocumentationButton.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    closeBundleMenu();
    documentationHeading.focus({ preventScroll: true });
  } else if (restoreFocus) {
    openDocumentationButton.focus({ preventScroll: true });
  }
}

function setNodeExpanded(isExpanded) {
  const expanded = Boolean(isExpanded)
    && !expandNodeButton.disabled
    && !contentPanel.hasAttribute("hidden");
  mathTraceState.nodeExpanded = expanded;
  workspace.classList.toggle("is-node-expanded", expanded);
  expandNodeButton.textContent = expanded ? "Shrink panel" : "Expand panel";
  expandNodeButton.title = expanded
    ? "Restore the dependency graph and node split view"
    : "Let the selected node cover both panels";
  expandNodeButton.setAttribute("aria-pressed", String(expanded));
}

function setContentPanelHidden(isHidden) {
  if (isHidden) {
    setNodeExpanded(false);
  }

  workspace.classList.toggle("is-content-hidden", isHidden);

  if (isHidden) {
    contentPanel.setAttribute("hidden", "");
  } else {
    contentPanel.removeAttribute("hidden");
  }

  toggleContentPanelButton.textContent = isHidden ? "Show content" : "Hide content";
  toggleContentPanelButton.title = isHidden ? "Show node content" : "Hide node content";
  toggleContentPanelButton.setAttribute("aria-expanded", String(!isHidden));
}

function showDialogStatus(message, isError = false) {
  dialogStatus.textContent = message;
  dialogStatus.classList.toggle("is-error", isError);
}

function activeProject() {
  return mathTraceState.projects.find(
    (project) => project.instanceId === mathTraceState.activeProjectInstanceId,
  ) || null;
}

function paperIsOpen(project = activeProject()) {
  return Boolean(project) && mathTraceState.viewMode === "paper";
}

function projectByInstanceId(instanceId) {
  return mathTraceState.projects.find((project) => project.instanceId === instanceId) || null;
}

function paperDeleteControl(projectInstanceId) {
  return Array.from(graphSurface.querySelectorAll(".graph-paper-delete-control"))
    .find((control) => control.dataset.projectInstanceId === projectInstanceId) || null;
}

function paperContainerId(project) {
  return `paper:${project.instanceId}`;
}

function isNativeNodeId(paperId, nodeId) {
  return nodeId.startsWith(`${paperId}.`);
}

function buildWorkspaceGraph() {
  return MathTraceProjectModel.buildPaperDependencyGraph(mathTraceState.projects);
}

function crossPaperDependenciesChanged() {
  if (!mathTraceState.workspaceGraph) {
    return true;
  }

  const previousSignature = MathTraceProjectModel.paperDependencyGraphSignature(
    mathTraceState.workspaceGraph,
  );
  const nextSignature = MathTraceProjectModel.paperDependencyGraphSignature(
    buildWorkspaceGraph(),
  );
  return previousSignature !== nextSignature;
}

function markWorkspaceGraphForFitIfChanged() {
  if (crossPaperDependenciesChanged()) {
    mathTraceState.workspaceGraphNeedsFit = true;
  }
}

function workspaceReturnState() {
  return mathTraceState.workspaceGraphNeedsFit || crossPaperDependenciesChanged()
    ? null
    : mathTraceState.workspaceGraphViewState;
}

function buildPaperGraph(project) {
  const nodes = project.graph.nodes.map((node) => {
    const isImported = !isNativeNodeId(project.paper.id, node.id);
    return {
      ...node,
      originalId: node.id,
      paperId: project.paper.id,
      isImported,
      sourcePaperId: isImported ? node.id.split(".", 1)[0] : project.paper.id,
      projectInstanceId: project.instanceId,
    };
  });

  return {
    ...project.graph,
    nodes,
    nodeById: new Map(nodes.map((node) => [node.id, node])),
    edges: project.graph.edges.map((edge) => ({ ...edge })),
    bundles: project.working.bundles.map((bundle) => ({
      ...bundle,
      members: [...bundle.members],
    })),
  };
}

function selectedGraphNode() {
  const selectedId = MathTraceGraphView.getState()?.selectedNodeId;
  return selectedId ? mathTraceState.currentGraph?.nodeById.get(selectedId) || null : null;
}

function showNodeEditorStatus(message, isError = false) {
  nodeEditorStatus.textContent = message;
  nodeEditorStatus.classList.toggle("is-error", isError);
}

function syncNodeSourceHighlight() {
  nodeSourceHighlight.innerHTML = MathTraceNodeEditor.highlightMathSource(nodeSourceEditor.value);
  nodeSourceHighlight.scrollTop = nodeSourceEditor.scrollTop;
  nodeSourceHighlight.scrollLeft = nodeSourceEditor.scrollLeft;
}

function syncNodeSourceHighlightScroll() {
  nodeSourceHighlight.scrollTop = nodeSourceEditor.scrollTop;
  nodeSourceHighlight.scrollLeft = nodeSourceEditor.scrollLeft;
}

function selectedEditableNode(project = activeProject()) {
  if (!project || mathTraceState.viewMode !== "paper") {
    return null;
  }

  const selected = selectedGraphNode();

  if (!selected || selected.projectInstanceId !== project.instanceId) {
    return null;
  }

  return project.graph.nodeById.get(selected.originalId || selected.id) || null;
}

function updateNodeActionButtons(node = selectedEditableNode()) {
  const enabled = Boolean(node)
    && nodeEditorView.hasAttribute("hidden")
    && !nodeDeleteDialog.open;
  expandNodeButton.toggleAttribute("disabled", !enabled);
  editNodeButton.toggleAttribute("disabled", !enabled);

  if (!enabled && mathTraceState.nodeExpanded) {
    setNodeExpanded(false);
  }

  expandNodeButton.title = enabled
    ? (mathTraceState.nodeExpanded
      ? "Restore the dependency graph and node split view"
      : `Expand ${node.title} across both panels`)
    : "Select an ordinary node to expand it";
  editNodeButton.title = enabled
    ? `Edit ${node.title}`
    : "Select an ordinary node to edit it";
}

function closeLinkedNodePreview({ restoreFocus = true } = {}) {
  if (linkedNodePreview.hasAttribute("hidden")) {
    return;
  }

  if (typeof window.MathJax?.typesetClear === "function") {
    window.MathJax.typesetClear([linkedNodeReader]);
  }

  MathTraceContentView.clearReaderResources(linkedNodeReader);
  linkedNodeReader.replaceChildren();
  linkedNodePreview.setAttribute("hidden", "");
  linkedNodePreview.setAttribute("inert", "");
  linkedNodePreview.setAttribute("aria-hidden", "true");
  closeLinkedNodePreviewButton.setAttribute("hidden", "");
  graphPanel.classList.remove("is-node-previewing");
  mathTraceState.linkedPreview.nodeId = null;
  restoreGraphPanelHeading();

  if (restoreFocus) {
    graphSurface.focus({ preventScroll: true });
  }
}

async function openLinkedNodePreview(nodeId) {
  const project = activeProject();
  const node = project?.graph.nodeById.get(nodeId);

  if (!project || !node || node.kind === "bundle") {
    return false;
  }

  if (!nodeEditorView.hasAttribute("hidden") && !closeNodeEditor()) {
    return false;
  }

  if (bundleEditorDialog.open) {
    closeBundleEditor();
  }

  closeBundleMenu();
  mathTraceState.linkedPreview.nodeId = node.id;
  linkedNodePreview.removeAttribute("hidden");
  linkedNodePreview.removeAttribute("inert");
  linkedNodePreview.setAttribute("aria-hidden", "false");
  closeLinkedNodePreviewButton.removeAttribute("hidden");
  graphPanel.classList.add("is-node-previewing");
  graphHeading.textContent = "Linked Node";
  await MathTraceContentView.renderNode({
    reader: linkedNodeReader,
    node,
    nodeTitleById: project.graph.nodeById,
    demoFiles: project.demoFiles,
  });
  closeLinkedNodePreviewButton.focus({ preventScroll: true });
  return true;
}

function restoreGraphPanelHeading() {
  const project = activeProject();
  graphHeading.textContent = paperIsOpen(project)
    ? `Dependency Graph · ${project.paper.id}`
    : "Paper Dependency Graph";
}

function nodeEditorIsDirty() {
  return !nodeEditorView.hasAttribute("hidden")
    && nodeSourceEditor.value !== mathTraceState.nodeEditor.originalText;
}

function setNodeEditorOpen(isOpen) {
  nodeEditorView.toggleAttribute("hidden", !isOpen);
  nodeEditorView.toggleAttribute("inert", !isOpen);
  nodeEditorView.setAttribute("aria-hidden", String(!isOpen));
  graphPanel.classList.toggle("is-node-editing", isOpen);
}

setNodeEditorOpen(false);

function closeNodeEditor({ discard = false, restoreFocus = true } = {}) {
  if (nodeEditorView.hasAttribute("hidden")) {
    return true;
  }

  if (
    !discard
    && nodeEditorIsDirty()
    && typeof window.confirm === "function"
    && !window.confirm("Discard the unsaved node changes?")
  ) {
    return false;
  }

  const previousMode = mathTraceState.nodeEditor.mode;
  const originalText = mathTraceState.nodeEditor.originalText;

  if (discard) {
    nodeSourceEditor.value = originalText;
    syncNodeSourceHighlight();
  }

  setNodeEditorOpen(false);
  mathTraceState.nodeEditor.mode = null;
  mathTraceState.nodeEditor.originalNodeId = null;
  mathTraceState.nodeEditor.originalText = "";
  deleteNodeButton.setAttribute("hidden", "");
  deleteNodeButton.setAttribute("disabled", "");
  showNodeEditorStatus("");
  restoreGraphPanelHeading();
  createNodeButton.toggleAttribute("disabled", !paperIsOpen());
  updateNodeActionButtons();

  if (restoreFocus) {
    (previousMode === "create" ? createNodeButton : editNodeButton).focus({ preventScroll: true });
  }

  return true;
}

function openNodeEditor({ mode, node = null, path, text }) {
  const project = activeProject();

  if (!paperIsOpen(project)) {
    return;
  }

  setNodeExpanded(false);

  if (bundleEditorDialog.open) {
    closeBundleEditor();
  }

  closeLinkedNodePreview({ restoreFocus: false });

  closeBundleMenu();
  mathTraceState.nodeEditor.mode = mode;
  mathTraceState.nodeEditor.originalNodeId = node?.id || null;
  mathTraceState.nodeEditor.originalText = text;
  nodeEditorKicker.textContent = mode === "create" ? "New node source" : "Node source";
  nodeEditorTitle.textContent = mode === "create" ? "Create node" : node.title;
  nodeEditorPath.textContent = path;
  nodeEditorContext.textContent = mode === "create"
    ? "New nodes are saved beneath nodes/newly-added/."
    : "Edit frontmatter or Markdown, then validate and save. The original file path is retained.";
  nodeSourceEditor.value = text;
  syncNodeSourceHighlight();
  saveNodeButton.textContent = mode === "create" ? "Create node" : "Save";
  deleteNodeButton.toggleAttribute("hidden", mode !== "edit");
  deleteNodeButton.toggleAttribute("disabled", mode !== "edit");
  deleteNodeButton.title = mode === "edit" ? `Delete ${node.title}` : "";
  showNodeEditorStatus("");
  setNodeEditorOpen(true);
  graphHeading.textContent = mode === "create" ? "Create node" : "Edit node";
  createNodeButton.setAttribute("disabled", "");
  expandNodeButton.setAttribute("disabled", "");
  editNodeButton.setAttribute("disabled", "");
  nodeSourceEditor.focus({ preventScroll: true });
}

function openCreateNodeEditor() {
  const project = activeProject();

  if (!paperIsOpen(project)) {
    return;
  }

  const template = MathTraceNodeEditor.createTemplate(project);
  openNodeEditor({
    mode: "create",
    path: template.path,
    text: template.text,
  });
}

function openEditNodeEditor() {
  const project = activeProject();
  const node = selectedEditableNode(project);

  if (!project || !node) {
    return;
  }

  const file = project.nodeFiles.find((candidate) => candidate.path === node.path);

  if (!file) {
    return;
  }

  openNodeEditor({
    mode: "edit",
    node,
    path: file.path,
    text: file.text,
  });
}

function closeNodeDeleteDialog({ restoreFocus = true } = {}) {
  if (nodeDeleteDialog.open) {
    nodeDeleteDialog.close();
  }

  mathTraceState.nodeDeletion.nodeId = null;
  confirmNodeDeleteButton.removeAttribute("disabled");
  confirmNodeDeleteButton.textContent = "Delete anyway";
  cancelNodeDeleteButton.removeAttribute("disabled");
  nodeDeleteDraftNote.setAttribute("hidden", "");
  nodeDeleteDraftNote.textContent = "";
  if (mathTraceState.nodeEditor.mode === "edit") {
    deleteNodeButton.removeAttribute("disabled");
  }
  updateNodeActionButtons();

  if (
    restoreFocus
    && !nodeEditorView.hasAttribute("hidden")
    && !deleteNodeButton.hasAttribute("hidden")
    && !deleteNodeButton.hasAttribute("disabled")
  ) {
    deleteNodeButton.focus({ preventScroll: true });
  }
}

function openNodeDeleteDialog() {
  const project = activeProject();
  const nodeId = mathTraceState.nodeEditor.mode === "edit"
    ? mathTraceState.nodeEditor.originalNodeId
    : null;
  const node = nodeId ? project?.graph.nodeById.get(nodeId) : null;

  if (!project || !node) {
    return;
  }

  const impact = MathTraceNodeEditor.analyzeDeletion(project, node.id);
  mathTraceState.nodeDeletion.nodeId = node.id;
  nodeDeleteName.textContent = node.title;
  nodeDeleteId.textContent = node.id;
  nodeDeleteDependentList.replaceChildren();

  for (const dependent of impact.dependents) {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    const id = document.createElement("code");
    title.textContent = dependent.title;
    id.textContent = dependent.id;
    item.append(title, " ", id);
    nodeDeleteDependentList.append(item);
  }

  const dependentCount = impact.dependents.length;
  nodeDeleteDependentSummary.textContent = dependentCount === 0
    ? "No other nodes directly require this node."
    : `${dependentCount} node${dependentCount === 1 ? "" : "s"} directly require${dependentCount === 1 ? "s" : ""} this node:`;
  nodeDeleteDependentList.toggleAttribute("hidden", dependentCount === 0);

  const wikiReferenceCount = impact.wikiReferenceNodes.reduce(
    (total, reference) => total + reference.count,
    0,
  );
  nodeDeleteWikilinkNote.textContent = wikiReferenceCount > 0
    ? `${wikiReferenceCount} matching wikilink${wikiReferenceCount === 1 ? "" : "s"} in ${impact.wikiReferenceNodes.length} node${impact.wikiReferenceNodes.length === 1 ? "" : "s"} will be marked as deleted references.`
    : "";
  nodeDeleteWikilinkNote.toggleAttribute("hidden", wikiReferenceCount === 0);

  nodeDeleteBundleNote.textContent = impact.bundles.length > 0
    ? `${impact.bundles.length} bundle${impact.bundles.length === 1 ? "" : "s"} will be repaired automatically. A bundle left with fewer than two nodes will be dissolved.`
    : "";
  nodeDeleteBundleNote.toggleAttribute("hidden", impact.bundles.length === 0);
  nodeDeleteDraftNote.textContent = nodeEditorIsDirty()
    ? "Unsaved edits in the source editor will be discarded if this node is deleted."
    : "";
  nodeDeleteDraftNote.toggleAttribute("hidden", !nodeEditorIsDirty());
  deleteNodeButton.setAttribute("disabled", "");
  updateNodeActionButtons(null);
  nodeDeleteDialog.showModal();
  cancelNodeDeleteButton.focus({ preventScroll: true });
}

function showDeletedNodeStatus(result) {
  contentHeading.textContent = "Node deleted";
  nodeReader.classList.add("is-empty");
  nodeReader.classList.remove("has-content", "is-bundle", "is-paper-overview");
  const status = document.createElement("div");
  status.className = "empty-state";
  const title = document.createElement("p");
  title.className = "empty-state-title";
  title.textContent = `${result.node.title} was deleted`;
  const description = document.createElement("p");
  description.textContent = result.dependents.length === 0
    ? "Select another node to continue."
    : `The requirement was removed from ${result.dependents.length} dependent node${result.dependents.length === 1 ? "" : "s"}.`;
  status.append(title, description);
  nodeReader.replaceChildren(status);
}

function closePaperDeleteDialog({ restoreFocus = true } = {}) {
  const projectInstanceId = mathTraceState.paperDeletion.projectInstanceId;

  if (paperDeleteDialog.open) {
    paperDeleteDialog.close();
  }

  mathTraceState.paperDeletion.projectInstanceId = null;
  cancelPaperDeleteButton.removeAttribute("disabled");
  confirmPaperDeleteButton.removeAttribute("disabled");
  confirmPaperDeleteButton.textContent = "Delete paper";

  if (restoreFocus && projectInstanceId) {
    paperDeleteControl(projectInstanceId)?.focus({ preventScroll: true });
  }
}

function openPaperDeleteDialog(project) {
  if (!project || mathTraceState.viewMode !== "workspace") {
    return;
  }

  const isEdited = MathTracePaperExport.hasChanges(project);
  mathTraceState.paperDeletion.projectInstanceId = project.instanceId;
  paperDeleteName.textContent = project.paper.title;
  paperDeleteId.textContent = project.paper.id;
  paperDeleteEditStatus.dataset.edited = String(isEdited);
  paperDeleteEditStatus.textContent = isEdited
    ? "Edited: this paper has in-browser changes. Deleting it will discard those changes unless you download the paper first."
    : "Unedited: this paper has no in-browser changes."
  paperDeleteDialog.showModal();
  cancelPaperDeleteButton.focus({ preventScroll: true });
}

function showDeletedPaperStatus(project) {
  contentHeading.textContent = "Paper deleted";
  nodeReader.classList.add("is-empty");
  nodeReader.classList.remove("has-content", "is-bundle", "is-paper-overview");
  const status = document.createElement("div");
  status.className = "empty-state";
  const title = document.createElement("p");
  title.className = "empty-state-title";
  title.textContent = `${project.paper.title} was deleted`;
  const description = document.createElement("p");
  description.textContent = mathTraceState.projects.length === 0
    ? "Add a paper to rebuild the cross-paper dependency graph."
    : "Select another paper to continue.";
  status.append(title, description);
  nodeReader.replaceChildren(status);
}

async function confirmPaperDeletion() {
  const projectInstanceId = mathTraceState.paperDeletion.projectInstanceId;
  const project = projectByInstanceId(projectInstanceId);

  if (!project) {
    closePaperDeleteDialog({ restoreFocus: false });
    return;
  }

  const wasActive = mathTraceState.activeProjectInstanceId === project.instanceId;
  const projectIndex = mathTraceState.projects.indexOf(project);
  const previousActiveProjectInstanceId = mathTraceState.activeProjectInstanceId;
  cancelPaperDeleteButton.setAttribute("disabled", "");
  confirmPaperDeleteButton.setAttribute("disabled", "");
  confirmPaperDeleteButton.textContent = "Deleting…";

  try {
    mathTraceState.projects = mathTraceState.projects.filter(
      (candidate) => candidate.instanceId !== project.instanceId,
    );

    if (wasActive) {
      mathTraceState.activeProjectInstanceId = null;
    }

    mathTraceState.workspaceGraphViewState = null;
    mathTraceState.workspaceGraphNeedsFit = true;
    closeLinkedNodePreview({ restoreFocus: false });
    setNodeExpanded(false);
    await renderWorkspaceGraph({
      showActiveOverview: !wasActive && Boolean(activeProject()),
      state: null,
    });
    closePaperDeleteDialog({ restoreFocus: false });

    if (wasActive) {
      showDeletedPaperStatus(project);
    }

    graphSurface.focus({ preventScroll: true });
  } catch (error) {
    mathTraceState.projects.splice(projectIndex, 0, project);
    mathTraceState.activeProjectInstanceId = previousActiveProjectInstanceId;
    try {
      await renderWorkspaceGraph({ showActiveOverview: Boolean(activeProject()) });
    } catch (renderError) {
      console.error("MathTrace could not restore the paper dependency graph.", renderError);
    }
    paperDeleteEditStatus.dataset.edited = "true";
    paperDeleteEditStatus.textContent = error instanceof Error
      ? error.message
      : "The paper could not be deleted.";
  } finally {
    cancelPaperDeleteButton.removeAttribute("disabled");
    confirmPaperDeleteButton.removeAttribute("disabled");
    confirmPaperDeleteButton.textContent = "Delete paper";
  }
}

async function confirmNodeDeletion() {
  const project = activeProject();
  const nodeId = mathTraceState.nodeDeletion.nodeId;

  if (!project || !nodeId) {
    return;
  }

  const previousState = MathTraceGraphView.getState();
  confirmNodeDeleteButton.setAttribute("disabled", "");
  cancelNodeDeleteButton.setAttribute("disabled", "");
  confirmNodeDeleteButton.textContent = "Deleting…";

  try {
    const result = MathTraceNodeEditor.deleteNode(project, nodeId);
    markWorkspaceGraphForFitIfChanged();
    await refreshGraphAfterBundleChange(project, previousState);
    project.graphReaderMode = "overview";
    project.graphViewState = MathTraceGraphView.getState();
    closeNodeDeleteDialog({ restoreFocus: false });
    closeNodeEditor({ discard: true, restoreFocus: false });
    showDeletedNodeStatus(result);
    updateNodeActionButtons(null);
    graphSurface.focus({ preventScroll: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The node could not be deleted.";
    nodeDeleteDependentSummary.textContent = message;
  } finally {
    cancelNodeDeleteButton.removeAttribute("disabled");
    confirmNodeDeleteButton.removeAttribute("disabled");
    confirmNodeDeleteButton.textContent = "Delete anyway";
  }
}

async function saveNodeEdits() {
  const project = activeProject();
  const { mode, originalNodeId } = mathTraceState.nodeEditor;

  if (!project || !mode) {
    return;
  }

  const previousState = MathTraceGraphView.getState();
  saveNodeButton.setAttribute("disabled", "");
  deleteNodeButton.setAttribute("disabled", "");
  cancelNodeEditButton.setAttribute("disabled", "");
  showNodeEditorStatus("Validating the node and dependency graph…");

  try {
    const savedText = nodeSourceEditor.value;
    const result = MathTraceNodeEditor.applyNodeSource(project, {
      mode,
      originalNodeId,
      text: savedText,
    });
    markWorkspaceGraphForFitIfChanged();
    await refreshGraphAfterBundleChange(project, previousState, result.node.id);

    mathTraceState.nodeEditor.originalText = savedText;
    closeNodeEditor({ discard: true, restoreFocus: false });
    editNodeButton.focus({ preventScroll: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The node could not be saved.";
    showNodeEditorStatus(message, true);
  } finally {
    saveNodeButton.removeAttribute("disabled");
    cancelNodeEditButton.removeAttribute("disabled");
    if (mathTraceState.nodeEditor.mode === "edit" && !nodeEditorView.hasAttribute("hidden")) {
      deleteNodeButton.removeAttribute("disabled");
    }
  }
}

function closeBundleMenu({ restoreFocus = false } = {}) {
  bundleMenuPopover.setAttribute("hidden", "");
  bundleMenuButton.setAttribute("aria-expanded", "false");

  if (restoreFocus) {
    bundleMenuButton.focus();
  }
}

function openBundleMenu() {
  if (bundleMenuButton.hasAttribute("disabled")) {
    return;
  }

  bundleMenuPopover.removeAttribute("hidden");
  bundleMenuButton.setAttribute("aria-expanded", "true");
  (bundleMenuList.querySelector(".bundle-menu-item") || createBundleButton).focus();
}

function updateBundleMenuState() {
  bundleMenuList.querySelectorAll(".bundle-menu-item").forEach((item) => {
    const isSelected = item.dataset.projectInstanceId === mathTraceState.activeProjectInstanceId;
    const isOpen = isSelected && mathTraceState.viewMode === "paper";
    item.classList.toggle("is-expanded", isOpen);
    item.classList.toggle("is-selected", isSelected);
    item.setAttribute("aria-current", isSelected ? "true" : "false");
    const expandedStatus = item.querySelector(".bundle-menu-expanded-status");
    expandedStatus.toggleAttribute("hidden", !isOpen);
  });
}

function populateBundleMenu() {
  const projects = mathTraceState.projects;
  bundleMenuList.replaceChildren();
  bundleMenuCount.textContent = String(projects.length);
  bundleMenuButton.toggleAttribute("disabled", projects.length === 0);

  if (projects.length === 0) {
    const empty = document.createElement("p");
    empty.className = "bundle-menu-empty";
    empty.textContent = "No papers are open.";
    bundleMenuList.append(empty);
  }

  for (const project of projects) {
    const row = document.createElement("div");
    row.className = "bundle-menu-row";
    const item = document.createElement("button");
    item.className = "bundle-menu-item";
    item.type = "button";
    item.dataset.bundleAction = "select";
    item.dataset.nodeId = paperContainerId(project);
    item.dataset.projectInstanceId = project.instanceId;
    item.setAttribute("aria-label", `Select paper ${project.paper.id}: ${project.paper.title}`);
    item.title = project.paper.title;
    const title = document.createElement("span");
    title.className = "bundle-menu-item-title";
    title.textContent = project.paper.id;
    const details = document.createElement("span");
    details.className = "bundle-menu-item-details";
    const memberCount = document.createElement("span");
    memberCount.textContent = `${project.graph.nodes.length} ${project.graph.nodes.length === 1 ? "node" : "nodes"}`;
    const status = document.createElement("span");
    status.className = "bundle-menu-item-status";
    const isEdited = MathTracePaperExport.hasChanges(project);
    status.dataset.status = isEdited ? "edited" : "unedited";
    status.textContent = isEdited ? "Edited" : "Unedited";
    const expandedStatus = document.createElement("span");
    expandedStatus.className = "bundle-menu-expanded-status";
    expandedStatus.textContent = "Open";
    expandedStatus.setAttribute("hidden", "");
    const statuses = document.createElement("span");
    statuses.className = "bundle-menu-statuses";
    statuses.append(status, expandedStatus);
    details.append(memberCount, statuses);
    item.append(title, details);
    const download = document.createElement("button");
    download.className = "paper-menu-download";
    download.type = "button";
    download.dataset.bundleAction = "download";
    download.dataset.projectInstanceId = project.instanceId;
    download.textContent = "Download";
    download.setAttribute("aria-label", `Download ${project.paper.id}`);
    row.append(item, download);
    bundleMenuList.append(row);
  }

  updateBundleMenuState();
  closeBundleMenu();
}

function bundleIdFromTitle(title) {
  const slug = String(title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug ? `bundle.${slug}` : "bundle.";
}

function showBundleEditorStatus(message, isSuccess = false) {
  bundleEditorStatus.textContent = message;
  bundleEditorStatus.classList.toggle("is-success", isSuccess);
}

function resetDeleteBundleButton() {
  deleteBundleButton.classList.remove("is-confirming");
  deleteBundleButton.textContent = "Delete bundle";
}

function closeBundleEditor() {
  MathTraceGraphView.clearBundleSelectionMode();

  if (bundleEditorDialog.open) {
    bundleEditorDialog.close();
  }

  mathTraceState.bundleEditor.editingBundleId = null;
  mathTraceState.bundleEditor.idManuallyEdited = false;
  mathTraceState.bundleEditor.absorbedBundleIds.clear();
  bundleMenuButton.toggleAttribute("disabled", !activeProject());
  resetDeleteBundleButton();
}

function selectedBundleMemberIds() {
  return Array.from(bundleNodeList.querySelectorAll('input[type="checkbox"]'))
    .filter((input) => input.checked)
    .map((input) => input.value);
}

function selectedAbsorbedBundleIds() {
  return Array.from(bundleAbsorbList.querySelectorAll('input[type="checkbox"]'))
    .filter((input) => input.checked)
    .map((input) => input.value);
}

function synchronizeAbsorbedBundleMembers() {
  const absorbedBundleIds = new Set(selectedAbsorbedBundleIds());
  mathTraceState.bundleEditor.absorbedBundleIds = absorbedBundleIds;

  bundleNodeList.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    const ownerBundleId = checkbox.dataset.ownerBundleId;

    if (!ownerBundleId) {
      return;
    }

    const isAbsorbed = absorbedBundleIds.has(ownerBundleId);
    checkbox.checked = isAbsorbed;
    checkbox.disabled = true;
    checkbox.closest(".bundle-node-option")?.classList.toggle("is-absorbed", isAbsorbed);
    checkbox.closest(".bundle-node-option")?.classList.toggle("is-unavailable", !isAbsorbed);
  });

  bundleAbsorbList.querySelectorAll(".bundle-absorb-option").forEach((option) => {
    const checkbox = option.querySelector('input[type="checkbox"]');
    option.classList.toggle("is-selected", Boolean(checkbox?.checked));
  });
}

function updateBundleSelectionState({ syncGraph = true } = {}) {
  synchronizeAbsorbedBundleMembers();
  const selectedIds = selectedBundleMemberIds();
  const absorbedCount = mathTraceState.bundleEditor.absorbedBundleIds.size;
  bundleSelectedCount.textContent = absorbedCount > 0
    ? `${selectedIds.length} selected · ${absorbedCount} bundle${absorbedCount === 1 ? "" : "s"} staged`
    : `${selectedIds.length} selected`;

  if (syncGraph) {
    MathTraceGraphView.updateBundleSelection({
      selectedNodeIds: selectedIds,
      selectedBundleIds: Array.from(mathTraceState.bundleEditor.absorbedBundleIds),
    });
  }
}

function filterBundleNodes() {
  const query = bundleNodeFilter.value.trim().toLowerCase();

  bundleNodeList.querySelectorAll(".bundle-node-option").forEach((option) => {
    option.toggleAttribute("hidden", Boolean(query) && !option.dataset.searchText.includes(query));
  });
  bundleAbsorbList.querySelectorAll(".bundle-absorb-option").forEach((option) => {
    option.toggleAttribute("hidden", Boolean(query) && !option.dataset.searchText.includes(query));
  });
}

function populateBundleNodePicker(project, bundle = null) {
  bundleNodeList.replaceChildren();
  bundleAbsorbList.replaceChildren();
  bundleAbsorbSection.toggleAttribute("hidden", Boolean(bundle));
  const claimedByOtherBundle = new Map();

  if (!bundle) {
    for (const existing of project.working.bundles) {
      const label = document.createElement("label");
      label.className = "bundle-absorb-option";
      label.dataset.searchText = `${existing.title} ${existing.id}`.toLowerCase();
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = existing.id;
      const text = document.createElement("span");
      const title = document.createElement("strong");
      title.textContent = existing.title;
      const details = document.createElement("small");
      details.textContent = `${existing.id} · ${existing.members.length} nodes`;
      text.append(title, details);
      label.append(checkbox, text);
      bundleAbsorbList.append(label);
    }
  }

  for (const existing of project.working.bundles) {
    if (existing.id === bundle?.id) {
      continue;
    }

    for (const memberId of existing.members) {
      claimedByOtherBundle.set(memberId, existing);
    }
  }

  const nodeById = project.graph.nodeById;
  const orderedNodeIds = [
    ...(bundle?.members || []),
    ...project.graph.nodes
      .map((node) => node.id)
      .filter((nodeId) => !bundle?.members.includes(nodeId)),
  ];

  for (const nodeId of orderedNodeIds) {
    const node = nodeById.get(nodeId);
    const ownerBundle = claimedByOtherBundle.get(node.id);
    const label = document.createElement("label");
    label.className = "bundle-node-option";
    label.dataset.searchText = `${node.title} ${node.id} ${node.kind}`.toLowerCase();
    label.classList.toggle("is-unavailable", Boolean(ownerBundle));
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = node.id;
    checkbox.checked = bundle?.members.includes(node.id) || false;
    checkbox.disabled = Boolean(ownerBundle);
    if (ownerBundle) {
      checkbox.dataset.ownerBundleId = ownerBundle.id;
    }
    const text = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = node.title;
    const details = document.createElement("small");
    details.textContent = ownerBundle
      ? `${node.kind} · ${node.id} · In ${ownerBundle.title}`
      : `${node.kind} · ${node.id}`;
    text.append(title, details);
    label.append(checkbox, text);
    bundleNodeList.append(label);
  }

  updateBundleSelectionState({ syncGraph: false });
  return Array.from(claimedByOtherBundle.keys());
}

function openBundleEditor(bundleId = null) {
  const project = activeProject();

  if (!project) {
    return;
  }

  const bundle = bundleId
    ? project.working.bundles.find((candidate) => candidate.id === bundleId)
    : null;

  if (bundleId && !bundle) {
    bundleMenuDescription.textContent = "That bundle is no longer available.";
    return;
  }

  mathTraceState.bundleEditor.editingBundleId = bundle?.id || null;
  mathTraceState.bundleEditor.idManuallyEdited = Boolean(bundle);
  mathTraceState.bundleEditor.absorbedBundleIds.clear();
  bundleEditorTitle.textContent = bundle ? "Edit bundle" : "Create bundle";
  saveBundleButton.textContent = bundle ? "Save changes" : "Create bundle";
  bundleTitleInput.value = bundle?.title || "";
  bundleIdInput.value = bundle?.id || "bundle.";
  bundleCollapsedInput.checked = bundle?.collapsed ?? true;
  bundleNodeFilter.value = "";
  deleteBundleButton.toggleAttribute("hidden", !bundle);
  resetDeleteBundleButton();
  showBundleEditorStatus("");
  const unavailableNodeIds = populateBundleNodePicker(project, bundle);
  MathTraceGraphView.setBundleSelectionMode({
    selectedNodeIds: selectedBundleMemberIds(),
    unavailableNodeIds,
    selectedBundleIds: [],
    selectableBundleIds: bundle ? [] : project.working.bundles.map((existing) => existing.id),
  });
  closeBundleMenu();
  bundleMenuButton.setAttribute("disabled", "");
  if (!bundleEditorDialog.open) {
    bundleEditorDialog.show();
  }
  bundleTitleInput.focus({ preventScroll: true });
}

async function renderGraph(graph, state = null) {
  mathTraceState.currentGraph = graph;
  return MathTraceGraphView.render({
    surface: graphSurface,
    svg: dependencyGraph,
    viewport: graphViewport,
    toolbar: graphToolbar,
    emptyState: graphEmptyState,
    graph,
    state,
  });
}

async function renderWorkspaceGraph({
  showActiveOverview = true,
  state = null,
} = {}) {
  mathTraceState.viewMode = "workspace";
  mathTraceState.paperGraph = null;
  mathTraceState.projects.forEach((project) => {
    project.viewMode = "workspace";
  });
  closeLinkedNodePreview({ restoreFocus: false });
  mathTraceState.workspaceGraph = buildWorkspaceGraph();
  dependencyGraph.removeAttribute("hidden");
  graphToolbar.removeAttribute("hidden");
  bundleMenu.removeAttribute("hidden");
  createNodeButton.setAttribute("hidden", "");
  createNodeButton.setAttribute("disabled", "");
  closePaperButton.setAttribute("hidden", "");
  graphHeading.textContent = "Paper Dependency Graph";
  graphSurface.setAttribute("aria-label", "Dependency graph of loaded MathTrace papers");
  updateNodeActionButtons(null);
  const view = await renderGraph(mathTraceState.workspaceGraph, state);
  mathTraceState.workspaceGraphViewState = MathTraceGraphView.getState();
  mathTraceState.workspaceGraphNeedsFit = false;
  populateBundleMenu();
  bundleMenuDescription.textContent = "Select a paper to read it; double-click its graph node to open it.";

  if (mathTraceState.projects.length === 0) {
    graphStatusTitle.textContent = "No papers loaded";
    graphStatusDescription.textContent = "Add a paper to rebuild the cross-paper dependency graph.";
    dependencyGraph.setAttribute("hidden", "");
    graphToolbar.setAttribute("hidden", "");
    graphEmptyState.removeAttribute("hidden");
    graphSurface.classList.remove("has-graph");
  }

  const project = activeProject();

  if (showActiveOverview && project) {
    await showPaperOverview(project, { rememberGraphMode: false });
  }

  return view;
}

async function renderOpenPaper(project, {
  state = null,
  preferredNodeId = null,
  showOverview = true,
} = {}) {
  mathTraceState.activeProjectInstanceId = project.instanceId;
  mathTraceState.viewMode = "paper";
  mathTraceState.projects.forEach((candidate) => {
    candidate.viewMode = candidate.instanceId === project.instanceId ? "paper" : "workspace";
  });
  mathTraceState.paperGraph = buildPaperGraph(project);
  dependencyGraph.removeAttribute("hidden");
  graphToolbar.removeAttribute("hidden");
  bundleMenu.removeAttribute("hidden");
  createNodeButton.removeAttribute("hidden");
  createNodeButton.removeAttribute("disabled");
  closePaperButton.removeAttribute("hidden");
  graphHeading.textContent = `Dependency Graph · ${project.paper.id}`;
  graphSurface.setAttribute("aria-label", `Dependency graph for ${project.paper.title}`);
  const view = await renderGraph(mathTraceState.paperGraph, state);
  project.graphViewState = MathTraceGraphView.getState();
  populateBundleMenu();
  bundleMenuDescription.textContent = `${project.paper.id} is open. Close it to return to paper dependencies.`;

  if (preferredNodeId && MathTraceGraphView.selectNodeById(preferredNodeId)) {
    return view;
  }

  updateNodeActionButtons(null);

  if (showOverview) {
    await showPaperOverview(project, { rememberGraphMode: false });
  }

  return view;
}

async function refreshGraphAfterBundleChange(project, state, preferredNodeId = null) {
  if (paperIsOpen(project)) {
    return renderOpenPaper(project, {
      state,
      preferredNodeId,
      showOverview: false,
    });
  }

  return renderWorkspaceGraph();
}

function normalizePath(path) {
  return path.replaceAll("\\", "/").replace(/^\/+/, "");
}

function selectedPath(file) {
  return normalizePath(file.webkitRelativePath || file.name);
}

function pathInsideSelectedFolder(path, folderName) {
  const folderPrefix = `${folderName}/`;
  return path.startsWith(folderPrefix) ? path.slice(folderPrefix.length) : path;
}

function isIgnoredPath(path) {
  return path.split("/").some((part) => (
    part === "__MACOSX"
    || part === ".DS_Store"
    || part.startsWith(".")
  ));
}

async function readMathTraceFolder(fileList) {
  const files = Array.from(fileList);

  if (files.length === 0) {
    throw new Error("No folder was selected.");
  }

  const firstPath = selectedPath(files[0]);
  const folderName = firstPath.split("/")[0];
  const entries = files
    .map((file) => {
      const fullPath = selectedPath(file);
      return {
        file,
        fullPath,
        paperPath: pathInsideSelectedFolder(fullPath, folderName),
      };
    })
    .filter((entry) => !isIgnoredPath(entry.paperPath));

  const paperFiles = entries.filter((entry) => entry.paperPath === "mathtrace.paper.md");

  if (paperFiles.length === 0) {
    throw new Error("The selected folder does not contain mathtrace.paper.md at its top level.");
  }

  if (paperFiles.length > 1) {
    throw new Error("The selected folder contains more than one top-level mathtrace.paper.md file.");
  }

  const paperEntry = paperFiles[0];
  const paperFile = { path: paperEntry.paperPath, text: await paperEntry.file.text() };
  const paperData = MathTraceParser.parsePaper(paperFile);
  const nodeDirectoryPrefix = `${paperData.graph.nodeDirectory}/`;
  const nodeEntries = entries
    .filter((entry) => (
      entry.paperPath.startsWith(nodeDirectoryPrefix)
      && entry.paperPath.toLowerCase().endsWith(".md")
    ))
    .sort((first, second) => first.paperPath.localeCompare(second.paperPath));

  if (nodeEntries.length === 0) {
    throw new Error(`No Markdown node files were found beneath ${paperData.graph.nodeDirectory}.`);
  }

  const demoEntries = entries
    .filter((entry) => entry.paperPath.startsWith("demos/"))
    .sort((first, second) => first.paperPath.localeCompare(second.paperPath));
  const [nodeTexts, demoBuffers] = await Promise.all([
    Promise.all(nodeEntries.map((entry) => entry.file.text())),
    Promise.all(demoEntries.map((entry) => entry.file.arrayBuffer())),
  ]);
  const nodeFiles = nodeEntries.map((entry, index) => ({
    path: entry.paperPath,
    text: nodeTexts[index],
  }));
  const demoFiles = demoEntries.map((entry, index) => ({
    path: entry.paperPath,
    bytes: new Uint8Array(demoBuffers[index]),
    type: entry.file.type || "application/octet-stream",
  }));
  return MathTraceProjectModel.fromNativeFolder({
    folderName,
    paperFile,
    nodeFiles,
    demoFiles,
  });
}

async function showPaperOverview(project, { rememberGraphMode = true } = {}) {
  if (rememberGraphMode && paperIsOpen(project)) {
    project.graphReaderMode = "overview";
  }

  contentHeading.textContent = "Selected paper";
  updateNodeActionButtons(null);
  await MathTraceContentView.renderPaperOverview({
    reader: nodeReader,
    paper: project.paper,
    nodeTitleById: project.graph.nodeById,
    demoFiles: project.demoFiles,
  });
}

async function openPaper(project) {
  if (!project || mathTraceState.viewMode !== "workspace") {
    return;
  }

  if (!nodeEditorView.hasAttribute("hidden") && !closeNodeEditor()) {
    return;
  }

  if (bundleEditorDialog.open) {
    closeBundleEditor();
  }

  mathTraceState.workspaceGraphViewState = MathTraceGraphView.getState();
  closeLinkedNodePreview({ restoreFocus: false });
  setNodeExpanded(false);
  await renderOpenPaper(project);
  graphSurface.focus({ preventScroll: true });
}

async function closeOpenPaper() {
  const project = activeProject();

  if (!paperIsOpen(project)) {
    return;
  }

  if (!nodeEditorView.hasAttribute("hidden") && !closeNodeEditor()) {
    return;
  }

  if (bundleEditorDialog.open) {
    closeBundleEditor();
  }

  project.graphViewState = MathTraceGraphView.getState();
  closeLinkedNodePreview({ restoreFocus: false });
  setNodeExpanded(false);
  await renderWorkspaceGraph({
    showActiveOverview: false,
    state: workspaceReturnState(),
  });
  MathTraceGraphView.selectNodeById(paperContainerId(project));
  graphSurface.focus({ preventScroll: true });
}

async function displayLoadedProject(project) {
  graphStatusTitle.textContent = "Laying out paper dependencies…";
  graphStatusDescription.textContent = "ELK is positioning the loaded papers.";
  readerStatusTitle.textContent = "Select a paper";
  readerStatusDescription.textContent = `${project.paper.title} is ready. Select its paper node to read the overview or double-click it to open the paper.`;
  showDialogStatus("The paper is valid. Rebuilding the paper dependency graph…");

  project.viewMode = "workspace";
  await renderWorkspaceGraph();
}

async function handlePaperFolderSelection(event) {
  const input = event.currentTarget;
  const previousProjectInstanceId = mathTraceState.activeProjectInstanceId;
  let pendingProject = null;

  openMathTraceFolderButton.disabled = true;
  openMathTraceFolderButton.textContent = "Reading folder…";
  showDialogStatus("Reading the paper manifest, nodes, and demonstrations…");

  try {
    const project = await readMathTraceFolder(input.files);
    pendingProject = project;
    mathTraceState.projects.push(project);
    mathTraceState.activeProjectInstanceId = previousProjectInstanceId;
    await displayLoadedProject(project);
    pendingProject = null;
    closePaperDialog();
  } catch (error) {
    if (pendingProject) {
      mathTraceState.projects = mathTraceState.projects.filter(
        (project) => project.instanceId !== pendingProject.instanceId,
      );
      mathTraceState.activeProjectInstanceId = previousProjectInstanceId;
    }

    const message = error instanceof Error ? error.message : "The selected folder could not be read.";
    showDialogStatus(message, true);
  } finally {
    openMathTraceFolderButton.disabled = false;
    openMathTraceFolderButton.textContent = "Open MathTrace folder";
  }
}

openPaperDialogButton.addEventListener("click", openPaperDialog);
openDocumentationButton.addEventListener("click", () => {
  setDocumentationOpen(!mathTraceState.documentationOpen);
});
closeDocumentationButton.addEventListener("click", () => {
  setDocumentationOpen(false);
});
toggleContentPanelButton.addEventListener("click", () => {
  setContentPanelHidden(!contentPanel.hasAttribute("hidden"));
});
expandNodeButton.addEventListener("click", () => {
  setNodeExpanded(!mathTraceState.nodeExpanded);
});
closePaperDialogButton.addEventListener("click", closePaperDialog);
openMathTraceFolderButton.addEventListener("click", () => {
  paperFolderInput.value = "";
  paperFolderInput.click();
});
paperFolderInput.addEventListener("change", handlePaperFolderSelection);
closePaperButton.addEventListener("click", closeOpenPaper);
createNodeButton.addEventListener("click", openCreateNodeEditor);
editNodeButton.addEventListener("click", openEditNodeEditor);
deleteNodeButton.addEventListener("click", openNodeDeleteDialog);
nodeEditorView.addEventListener("pointerdown", (event) => event.stopPropagation());
linkedNodePreview.addEventListener("pointerdown", (event) => event.stopPropagation());
closeLinkedNodePreviewButton.addEventListener("click", () => closeLinkedNodePreview());
cancelNodeEditButton.addEventListener("click", (event) => {
  event.preventDefault();
  closeNodeEditor({ discard: true });
});
saveNodeButton.addEventListener("click", saveNodeEdits);
cancelNodeDeleteButton.addEventListener("click", () => closeNodeDeleteDialog());
confirmNodeDeleteButton.addEventListener("click", confirmNodeDeletion);
nodeDeleteDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeNodeDeleteDialog();
});
cancelPaperDeleteButton.addEventListener("click", () => closePaperDeleteDialog());
confirmPaperDeleteButton.addEventListener("click", confirmPaperDeletion);
paperDeleteDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closePaperDeleteDialog();
});
paperDeleteDialog.addEventListener("click", (event) => {
  if (event.target === paperDeleteDialog) {
    closePaperDeleteDialog();
  }
});
nodeSourceEditor.addEventListener("input", () => {
  syncNodeSourceHighlight();
  showNodeEditorStatus("");
});
nodeSourceEditor.addEventListener("scroll", syncNodeSourceHighlightScroll);
bundleMenuButton.addEventListener("click", () => {
  if (bundleMenuPopover.hasAttribute("hidden")) {
    openBundleMenu();
  } else {
    closeBundleMenu({ restoreFocus: true });
  }
});
bundleMenuList.addEventListener("click", async (event) => {
  const action = event.target.closest("[data-bundle-action]");

  if (!action) {
    return;
  }

  if (action.dataset.bundleAction === "download") {
    const project = projectByInstanceId(action.dataset.projectInstanceId);

    if (project) {
      const result = MathTracePaperExport.downloadProject(project);
      bundleMenuDescription.textContent = `Downloaded ${result.fileName}.`;
    }
  } else if (action.dataset.bundleAction === "edit") {
    openBundleEditor(action.dataset.bundleId);
  } else {
    closeBundleMenu();
    const project = projectByInstanceId(action.dataset.projectInstanceId);

    if (!project) {
      return;
    }

    if (mathTraceState.viewMode === "paper") {
      await renderWorkspaceGraph({
        showActiveOverview: false,
        state: workspaceReturnState(),
      });
    }

    MathTraceGraphView.selectNodeById(paperContainerId(project));
  }
});
bundleMenuList.addEventListener("keydown", (event) => {
  const items = Array.from(bundleMenuList.querySelectorAll("button:not(:disabled)"));
  const currentIndex = items.indexOf(document.activeElement);
  let nextIndex = null;

  if (event.key === "ArrowDown") {
    nextIndex = (currentIndex + 1) % items.length;
  } else if (event.key === "ArrowUp") {
    nextIndex = (currentIndex - 1 + items.length) % items.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = items.length - 1;
  } else if (event.key === "Escape") {
    event.preventDefault();
    closeBundleMenu({ restoreFocus: true });
    return;
  }

  if (nextIndex !== null && items.length > 0) {
    event.preventDefault();
    items[nextIndex].focus();
  }
});
createBundleButton.addEventListener("click", () => {
  closeBundleMenu();
  openPaperDialog();
});
bundleTitleInput.addEventListener("input", () => {
  if (!mathTraceState.bundleEditor.idManuallyEdited) {
    bundleIdInput.value = bundleIdFromTitle(bundleTitleInput.value);
  }
});
bundleIdInput.addEventListener("input", () => {
  mathTraceState.bundleEditor.idManuallyEdited = true;
});
bundleNodeList.addEventListener("change", () => {
  updateBundleSelectionState();
  showBundleEditorStatus("");
});
bundleAbsorbList.addEventListener("change", () => {
  updateBundleSelectionState();
  showBundleEditorStatus("");
});
bundleNodeFilter.addEventListener("input", filterBundleNodes);
closeBundleEditorButton.addEventListener("click", closeBundleEditor);
cancelBundleEditorButton.addEventListener("click", closeBundleEditor);
bundleEditorForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const project = activeProject();

  if (!project) {
    return;
  }

  const editingBundleId = mathTraceState.bundleEditor.editingBundleId;
  const previousState = MathTraceGraphView.getState();
  const draft = {
    id: bundleIdInput.value,
    title: bundleTitleInput.value,
    collapsed: bundleCollapsedInput.checked,
    members: selectedBundleMemberIds(),
    absorbedBundleIds: Array.from(mathTraceState.bundleEditor.absorbedBundleIds),
  };
  saveBundleButton.disabled = true;
  saveBundleButton.textContent = "Saving…";

  try {
    const savedBundle = MathTraceBundleEditor.saveBundle(project, draft, editingBundleId);
    await refreshGraphAfterBundleChange(
      project,
      previousState,
      savedBundle.collapsed ? savedBundle.id : savedBundle.representative,
    );
    closeBundleEditor();
    bundleMenuDescription.textContent = `${savedBundle.title} was saved to the working configuration.`;
  } catch (error) {
    const message = error instanceof Error ? error.message : "The bundle could not be saved.";
    showBundleEditorStatus(message);
  } finally {
    saveBundleButton.disabled = false;
    saveBundleButton.textContent = editingBundleId ? "Save changes" : "Create bundle";
  }
});
deleteBundleButton.addEventListener("click", async () => {
  const project = activeProject();
  const editingBundleId = mathTraceState.bundleEditor.editingBundleId;

  if (!project || !editingBundleId) {
    return;
  }

  if (!deleteBundleButton.classList.contains("is-confirming")) {
    deleteBundleButton.classList.add("is-confirming");
    deleteBundleButton.textContent = "Confirm delete";
    showBundleEditorStatus("Deleting removes this working bundle but does not delete any node files.");
    return;
  }

  const previousState = MathTraceGraphView.getState();
  deleteBundleButton.disabled = true;

  try {
    const deletedBundle = MathTraceBundleEditor.deleteBundle(project, editingBundleId);
    await refreshGraphAfterBundleChange(project, previousState, deletedBundle.representative);
    closeBundleEditor();
    bundleMenuDescription.textContent = `${deletedBundle.title} was removed from the working configuration.`;
  } catch (error) {
    const message = error instanceof Error ? error.message : "The bundle could not be deleted.";
    showBundleEditorStatus(message);
  } finally {
    deleteBundleButton.disabled = false;
  }
});
document.addEventListener("pointerdown", (event) => {
  if (!bundleMenu.contains(event.target)) {
    closeBundleMenu();
  }
});
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s" && !nodeEditorView.hasAttribute("hidden")) {
    event.preventDefault();
    saveNodeEdits();
  } else if (event.key === "Escape" && !nodeEditorView.hasAttribute("hidden")) {
    event.preventDefault();
    closeNodeEditor();
  } else if (event.key === "Escape" && !linkedNodePreview.hasAttribute("hidden")) {
    event.preventDefault();
    closeLinkedNodePreview();
  } else if (event.key === "Escape" && bundleEditorDialog.open) {
    event.preventDefault();
    closeBundleEditor();
  } else if (event.key === "Escape" && mathTraceState.documentationOpen) {
    event.preventDefault();
    setDocumentationOpen(false);
  } else if (event.key === "Escape" && mathTraceState.nodeExpanded) {
    event.preventDefault();
    setNodeExpanded(false);
    expandNodeButton.focus({ preventScroll: true });
  }
});

graphSurface.addEventListener("mathtrace:bundle-member-toggle", (event) => {
  const checkbox = Array.from(bundleNodeList.querySelectorAll('input[type="checkbox"]'))
    .find((input) => input.value === event.detail.nodeId);

  if (!checkbox) {
    return;
  }

  checkbox.checked = event.detail.selected;
  updateBundleSelectionState({ syncGraph: false });
  showBundleEditorStatus("");
});
graphSurface.addEventListener("mathtrace:bundle-member-unavailable", (event) => {
  const project = activeProject();
  const node = project?.graph.nodeById.get(event.detail.nodeId);
  showBundleEditorStatus(
    `${node?.title || event.detail.nodeId} already belongs to another bundle. Edit that bundle first to release it.`,
  );
});
graphSurface.addEventListener("mathtrace:bundle-toggle", (event) => {
  const checkbox = Array.from(bundleAbsorbList.querySelectorAll('input[type="checkbox"]'))
    .find((input) => input.value === event.detail.bundleId);

  if (!checkbox) {
    return;
  }

  checkbox.checked = event.detail.selected;
  updateBundleSelectionState({ syncGraph: false });
  showBundleEditorStatus("");
});

graphSurface.addEventListener("mathtrace:node-select", async (event) => {
  const graphNode = event.detail.node;
  const project = projectByInstanceId(graphNode.projectInstanceId);

  if (!project) {
    return;
  }

  mathTraceState.activeProjectInstanceId = project.instanceId;
  createNodeButton.toggleAttribute("disabled", mathTraceState.viewMode !== "paper");
  updateBundleMenuState();

  if (graphNode.kind === "paper") {
    project.graphReaderMode = "overview";
    await showPaperOverview(project, { rememberGraphMode: false });
    return;
  }

  const node = project.graph.nodeById.get(graphNode.originalId || graphNode.id);

  if (!node) {
    return;
  }

  project.graphReaderMode = "node";
  project.graphViewState = MathTraceGraphView.getState();
  contentHeading.textContent = "Selected node";
  updateNodeActionButtons(node);
  await MathTraceContentView.renderNode({
    reader: nodeReader,
    node,
    nodeTitleById: project.graph.nodeById,
    demoFiles: project.demoFiles,
  });
});

graphSurface.addEventListener("mathtrace:node-open", async (event) => {
  const graphNode = event.detail.node;
  const project = projectByInstanceId(graphNode.projectInstanceId);

  if (graphNode.kind === "paper" && project) {
    await openPaper(project);
  }
});

graphSurface.addEventListener("mathtrace:paper-delete-request", (event) => {
  const graphNode = event.detail.node;
  const project = projectByInstanceId(graphNode.projectInstanceId);

  if (graphNode.kind === "paper" && project) {
    openPaperDeleteDialog(project);
  }
});

graphSurface.addEventListener("mathtrace:bundle-state-change", (event) => {
  updateBundleMenuState();
  const project = activeProject();

  if (paperIsOpen(project)) {
    project.graphViewState = MathTraceGraphView.getState();
  }
});

nodeReader.addEventListener("mathtrace:node-link", async (event) => {
  const project = activeProject();

  setNodeExpanded(false);

  if (project && mathTraceState.viewMode === "workspace") {
    await openPaper(project);
  }

  await openLinkedNodePreview(event.detail.nodeId);
});

linkedNodeReader.addEventListener("mathtrace:node-link", async (event) => {
  await openLinkedNodePreview(event.detail.nodeId);
});

nodeReader.addEventListener("mathtrace:bundle-expand", async (event) => {
  try {
    await MathTraceGraphView.expandBundle(event.detail.bundleId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "The bundle could not be expanded.";
    console.error(message, error);
  }
});

nodeReader.addEventListener("mathtrace:bundle-collapse", (event) => {
  MathTraceGraphView.collapseBundle(event.detail.bundleId);
});

paperDialog.addEventListener("click", (event) => {
  if (event.target === paperDialog) {
    closePaperDialog();
  }
});
bundleEditorDialog.addEventListener("click", (event) => {
  if (event.target === bundleEditorDialog) {
    closeBundleEditor();
  }
});
bundleEditorDialog.addEventListener("close", () => {
  MathTraceGraphView.clearBundleSelectionMode();
  mathTraceState.bundleEditor.editingBundleId = null;
  mathTraceState.bundleEditor.idManuallyEdited = false;
  mathTraceState.bundleEditor.absorbedBundleIds.clear();
  bundleMenuButton.toggleAttribute("disabled", !activeProject());
  resetDeleteBundleButton();
});

async function initializeMathTrace() {
  try {
    const requiredGlobals = [
      "ELK",
      "jsyaml",
      "markdownit",
      "MathTraceParser",
      "MathTraceProjectModel",
      "MathTraceGraphView",
      "MathTraceBundleEditor",
      "MathTraceNodeEditor",
      "MathTraceContentView",
      "MathTracePaperExport",
    ];
    const missing = requiredGlobals.filter((name) => !globalThis[name]);

    if (missing.length > 0) {
      throw new Error(`Required components are missing: ${missing.join(", ")}.`);
    }

    if (!globalThis.MathJax?.startup?.promise) {
      throw new Error("The mathematics renderer did not initialize.");
    }

    await globalThis.MathJax.startup.promise;
    await globalThis.MathTraceBoot.ready();
    openPaperDialog();
  } catch (error) {
    const message = error instanceof Error ? error.message : "The paper viewer could not initialize.";
    globalThis.MathTraceBoot.fail(message);
  }
}

initializeMathTrace();

globalThis.mathTraceState = mathTraceState;
