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
const paperCardView = document.querySelector("#paper-card-view");
const paperCardId = document.querySelector("#paper-card-id");
const paperCardTitle = document.querySelector("#paper-card-title");
const paperCardAuthors = document.querySelector("#paper-card-authors");
const paperCardStatus = document.querySelector("#paper-card-status");
const paperCardDate = document.querySelector("#paper-card-date");
const paperCardNodeCount = document.querySelector("#paper-card-node-count");
const paperCardBundleCount = document.querySelector("#paper-card-bundle-count");
const expandPaperButton = document.querySelector("#expand-paper-button");
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
  linkedPreview: {
    nodeId: null,
  },
  workspaceGraph: null,
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
  expandNodeButton.textContent = expanded ? "Shrink node" : "Expand node";
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

function projectByInstanceId(instanceId) {
  return mathTraceState.projects.find((project) => project.instanceId === instanceId) || null;
}

function paperContainerId(project) {
  return `paper:${project.instanceId}`;
}

function workspaceNodeId(project, nodeId) {
  return `node:${project.instanceId}:${nodeId}`;
}

function buildWorkspaceGraph() {
  const nodes = [];
  const edges = [];
  const papers = [];

  for (const project of mathTraceState.projects) {
    const localId = (nodeId) => workspaceNodeId(project, nodeId);

    for (const node of project.graph.nodes) {
      nodes.push({
        ...node,
        id: localId(node.id),
        originalId: node.id,
        projectInstanceId: project.instanceId,
        requires: node.requires.map(localId),
      });
    }

    project.graph.edges.forEach((edge, index) => {
      edges.push({
        ...edge,
        id: `workspace-edge:${project.instanceId}:${index}`,
        source: localId(edge.source),
        target: localId(edge.target),
        projectInstanceId: project.instanceId,
      });
    });

    const members = project.graph.nodes.map((node) => localId(node.id));

    if (members.length > 0) {
      papers.push({
        id: paperContainerId(project),
        kind: "paper",
        title: project.paper.title,
        representative: members[0],
        collapsed: true,
        members,
        paperId: project.paper.id,
        paper: project.paper,
        projectInstanceId: project.instanceId,
      });
    }
  }

  return {
    nodes,
    nodeById: new Map(nodes.map((node) => [node.id, node])),
    edges,
    bundles: papers,
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

function selectedWorkspaceNode() {
  const selectedId = MathTraceGraphView.getState()?.selectedNodeId;
  return selectedId ? mathTraceState.workspaceGraph?.nodeById.get(selectedId) || null : null;
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
  if (!project) {
    return null;
  }

  const selected = selectedWorkspaceNode();

  if (!selected || selected.projectInstanceId !== project.instanceId) {
    return null;
  }

  return project.graph.nodeById.get(selected.originalId) || null;
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
  graphHeading.textContent = "Dependency Graph";
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
  createNodeButton.toggleAttribute("disabled", !activeProject());
  updateNodeActionButtons();

  if (restoreFocus) {
    (previousMode === "create" ? createNodeButton : editNodeButton).focus({ preventScroll: true });
  }

  return true;
}

function openNodeEditor({ mode, node = null, path, text }) {
  const project = activeProject();

  if (!project) {
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

  if (!project) {
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
    await refreshGraphAfterBundleChange(project, previousState);
    project.graphReaderMode = "overview";
    project.graphViewState = MathTraceGraphView.getState();
    populatePaperCard(project);
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
    populatePaperCard(project);

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

function populatePaperCard(project) {
  const { paper, graph } = project;
  paperCardId.textContent = paper.id;
  paperCardTitle.textContent = paper.title;
  paperCardAuthors.textContent = paper.authors.length > 0
    ? paper.authors.map((author) => author.name).join(", ")
    : "Authors not specified";
  paperCardStatus.textContent = paper.status || "Not specified";
  paperCardDate.textContent = paper.date || "Not specified";
  paperCardNodeCount.textContent = String(graph.nodes.length);
  paperCardBundleCount.textContent = String(graph.bundles.length);
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
    const isExpanded = MathTraceGraphView.isBundleExpanded(item.dataset.nodeId);
    const isSelected = item.dataset.projectInstanceId === mathTraceState.activeProjectInstanceId;
    item.classList.toggle("is-expanded", isExpanded);
    item.classList.toggle("is-selected", isSelected);
    item.setAttribute("aria-current", isSelected ? "true" : "false");
    const expandedStatus = item.querySelector(".bundle-menu-expanded-status");
    expandedStatus.toggleAttribute("hidden", !isExpanded);
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
    expandedStatus.textContent = "Expanded";
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

async function refreshGraphAfterBundleChange(project, state, preferredNodeId = null) {
  mathTraceState.workspaceGraph = buildWorkspaceGraph();
  const paperIds = new Set(mathTraceState.workspaceGraph.bundles.map((paper) => paper.id));
  const validExpandedIds = (state?.expandedBundleIds || [])
    .filter((paperId) => paperIds.has(paperId));
  const restorableSelection = state?.selectedNodeId && (
    mathTraceState.workspaceGraph.nodeById.has(state.selectedNodeId)
    || paperIds.has(state.selectedNodeId)
  );
  const safeState = state ? {
    ...state,
    selectedNodeId: restorableSelection ? state.selectedNodeId : null,
    expandedBundleId: validExpandedIds[0] || null,
    expandedBundleIds: validExpandedIds,
    expandedBundlePositions: Object.fromEntries(
      validExpandedIds
        .filter((paperId) => state.expandedBundlePositions?.[paperId])
        .map((paperId) => [paperId, state.expandedBundlePositions[paperId]]),
    ),
  } : null;
  const view = await MathTraceGraphView.render({
    surface: graphSurface,
    svg: dependencyGraph,
    viewport: graphViewport,
    toolbar: graphToolbar,
    emptyState: graphEmptyState,
    graph: mathTraceState.workspaceGraph,
    state: safeState,
  });
  mathTraceState.projects.forEach((candidate) => {
    candidate.view = view;
    candidate.graphViewState = MathTraceGraphView.getState();
  });
  populateBundleMenu();

  if (preferredNodeId) {
    MathTraceGraphView.selectNodeById(workspaceNodeId(project, preferredNodeId));
  }

  updateBundleMenuState();
  createNodeButton.toggleAttribute("disabled", !activeProject());
  restoreGraphPanelHeading();
  return view;
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
  if (rememberGraphMode && project.viewMode === "graph") {
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

async function setProjectViewMode(project, mode, { restoreReader = true } = {}) {
  const isCard = mode === "card";

  if (isCard) {
    closeLinkedNodePreview({ restoreFocus: false });
  }

  if (isCard && bundleEditorDialog.open) {
    closeBundleEditor();
  }

  project.viewMode = mode;
  graphSurface.classList.toggle("is-paper-card", isCard);
  paperCardView.toggleAttribute("hidden", !isCard);
  dependencyGraph.toggleAttribute("hidden", isCard);
  graphToolbar.toggleAttribute("hidden", isCard);
  createNodeButton.toggleAttribute("hidden", isCard);
  bundleMenu.toggleAttribute("hidden", isCard);

  if (isCard) {
    closeBundleMenu();
    graphHeading.textContent = "Research paper";
    graphSurface.setAttribute("aria-label", `Paper card for ${project.paper.title}`);
    project.graphViewState = MathTraceGraphView.getState();
    createNodeButton.setAttribute("disabled", "");
    updateNodeActionButtons(null);
    await showPaperOverview(project, { rememberGraphMode: false });
    return;
  }

  graphHeading.textContent = "Dependency Graph";
  graphSurface.setAttribute("aria-label", `Dependency graph for ${project.paper.title}`);
  createNodeButton.removeAttribute("disabled");

  if (
    restoreReader
    && project.graphReaderMode === "node"
    && project.graphViewState?.selectedNodeId
    && MathTraceGraphView.selectNodeById(project.graphViewState.selectedNodeId)
  ) {
    return;
  }

  await showPaperOverview(project);
}

async function displayLoadedProject(project) {
  graphStatusTitle.textContent = "Laying out dependency graph…";
  graphStatusDescription.textContent = "ELK is positioning the collapsed paper graph.";
  readerStatusTitle.textContent = "Select a paper";
  readerStatusDescription.textContent = project.paper.isFallback
    ? `${project.paper.title} is ready, but no mathtrace.paper.md was supplied.`
    : `${project.paper.title} is ready. Select its paper card once to read mathtrace.paper.md and again to expand its dependency graph.`;
  showDialogStatus("The paper is valid. Laying out the dependency graph…");

  const previousState = MathTraceGraphView.getState();
  project.viewMode = "workspace";
  populatePaperCard(project);
  paperCardView.setAttribute("hidden", "");
  graphSurface.classList.remove("is-paper-card");
  dependencyGraph.removeAttribute("hidden");
  graphToolbar.removeAttribute("hidden");
  bundleMenu.removeAttribute("hidden");
  await refreshGraphAfterBundleChange(project, previousState);
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
expandPaperButton.addEventListener("click", async () => {
  const project = activeProject();

  if (!project) {
    return;
  }

  await setProjectViewMode(project, "graph");
  graphSurface.focus({ preventScroll: true });
});
graphSurface.addEventListener("mathtrace:paper-collapse", async () => {
  const project = activeProject();

  if (!project || (!nodeEditorView.hasAttribute("hidden") && !closeNodeEditor())) {
    return;
  }

  await setProjectViewMode(project, "card");
  expandPaperButton.focus({ preventScroll: true });
});
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
bundleMenuList.addEventListener("click", (event) => {
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
    MathTraceGraphView.selectNodeById(action.dataset.nodeId);
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
  const workspaceNode = event.detail.node;
  const project = projectByInstanceId(workspaceNode.projectInstanceId);

  if (!project) {
    return;
  }

  mathTraceState.activeProjectInstanceId = project.instanceId;
  createNodeButton.removeAttribute("disabled");
  updateBundleMenuState();

  if (workspaceNode.kind === "paper") {
    project.graphReaderMode = "overview";
    project.graphViewState = MathTraceGraphView.getState();
    await showPaperOverview(project, { rememberGraphMode: false });
    return;
  }

  const node = project.graph.nodeById.get(workspaceNode.originalId);

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

graphSurface.addEventListener("mathtrace:bundle-state-change", (event) => {
  updateBundleMenuState();
  const state = MathTraceGraphView.getState();
  mathTraceState.projects.forEach((project) => {
    project.graphViewState = state;
  });
});

nodeReader.addEventListener("mathtrace:node-link", async (event) => {
  const project = activeProject();

  setNodeExpanded(false);

  if (project?.viewMode === "card") {
    await setProjectViewMode(project, "graph", { restoreReader: false });
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

paperCardView.addEventListener("click", async (event) => {
  if (event.target.closest("#expand-paper-button")) {
    return;
  }

  const project = activeProject();

  if (project?.viewMode === "card") {
    await showPaperOverview(project, { rememberGraphMode: false });
  }
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
