(function createMathTraceGraphView(globalScope) {
  "use strict";

  const NODE_WIDTH = 164;
  const NODE_HEIGHT = 78;
  const BUNDLE_WIDTH = 184;
  const BUNDLE_HEIGHT = 78;
  const BUNDLE_MEMBER_WIDTH = 154;
  const BUNDLE_MEMBER_HEIGHT = 76;
  const BUNDLE_ISLAND_HEADER = 44;
  const BUNDLE_ISLAND_PADDING = 18;
  const MIN_SCALE = 0.16;
  const MAX_SCALE = 2.6;
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const elk = new globalScope.ELK();
  let activeView = null;

  function createSvgElement(name, attributes = {}) {
    const element = document.createElementNS(SVG_NAMESPACE, name);

    for (const [attribute, value] of Object.entries(attributes)) {
      element.setAttribute(attribute, String(value));
    }

    return element;
  }

  function hideElement(element) {
    element.setAttribute("hidden", "");
  }

  function showElement(element) {
    element.removeAttribute("hidden");
  }

  function nodeStyleKind(kind) {
    if ([
      "definition",
      "lemma",
      "proposition",
      "corollary",
      "theorem",
      "example",
      "bundle",
      "paper",
    ].includes(kind)) {
      return kind;
    }

    return "default";
  }

  function visibleGraphHasCycle(nodes, edges) {
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

    return visited !== nodes.length;
  }

  function buildVisibleGraph(graph) {
    const collapsedBundles = graph.bundles.filter((bundle) => bundle.collapsed);
    const memberToBundle = new Map();

    for (const bundle of collapsedBundles) {
      for (const memberId of bundle.members) {
        memberToBundle.set(memberId, bundle.id);
      }
    }

    const nodes = collapsedBundles.map((bundle) => ({
      ...bundle,
      id: bundle.id,
      kind: bundle.kind || "bundle",
      title: bundle.title,
      memberCount: bundle.members.length,
      representative: bundle.representative,
      members: bundle.members,
      width: BUNDLE_WIDTH,
      height: BUNDLE_HEIGHT,
    }));

    for (const node of graph.nodes) {
      if (!memberToBundle.has(node.id)) {
        nodes.push({
          ...node,
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
        });
      }
    }

    const edgeByEndpoints = new Map();

    for (const edge of graph.edges) {
      const source = memberToBundle.get(edge.source) || edge.source;
      const target = memberToBundle.get(edge.target) || edge.target;

      if (source === target && graph.bundling.removeInternalEdges !== false) {
        continue;
      }

      const key = `${source}\u0000${target}`;
      const existing = edgeByEndpoints.get(key);

      if (existing && graph.bundling.deduplicateExternalEdges !== false) {
        existing.originalEdgeCount += 1;
        existing.originalEdges.push({ ...edge });
        continue;
      }

      const visibleEdge = {
        id: `visible-edge-${edgeByEndpoints.size}`,
        source,
        target,
        originalEdgeCount: 1,
        originalEdges: [{ ...edge }],
      };
      edgeByEndpoints.set(existing ? `${key}\u0000${edge.id}` : key, visibleEdge);
    }

    const edges = Array.from(edgeByEndpoints.values());

    if (graph.bundling.rejectCyclesAfterBundling === true && visibleGraphHasCycle(nodes, edges)) {
      throw new Error("The selected collapsed bundles create a cycle in the visible dependency graph.");
    }

    return {
      nodes,
      edges,
      collapsedBundleCount: collapsedBundles.length,
      memberToBundle,
      originalNodeCount: graph.nodes.length,
      originalEdgeCount: graph.edges.length,
    };
  }

  function createElkInput(visibleGraph, layout = {}) {
    const algorithm = String(layout.algorithm || "layered").toLowerCase();
    const direction = String(layout.direction || "DOWN").toUpperCase();
    const nodePlacement = String(layout.nodePlacementStrategy || "NETWORK_SIMPLEX").toUpperCase();

    return {
      id: "mathtrace-root",
      layoutOptions: {
        "elk.algorithm": algorithm,
        "elk.direction": direction,
        "elk.edgeRouting": "ORTHOGONAL",
        "elk.layered.nodePlacement.strategy": nodePlacement,
        "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
        "elk.layered.spacing.nodeNodeBetweenLayers": "54",
        "elk.layered.spacing.edgeNodeBetweenLayers": "18",
        "elk.spacing.nodeNode": "32",
        "elk.padding": "[top=36,left=36,bottom=36,right=36]",
      },
      children: visibleGraph.nodes.map((node) => ({
        id: node.id,
        width: node.width,
        height: node.height,
      })),
      edges: visibleGraph.edges.map((edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      })),
    };
  }

  function createMarkerDefinitions(svg) {
    const definitions = createSvgElement("defs");

    [
      ["dependency-arrow", "#8995a8"],
      ["dependency-arrow-prerequisite", "#2d68b7"],
      ["dependency-arrow-dependent", "#8754b3"],
    ].forEach(([id, fill]) => {
      const marker = createSvgElement("marker", {
        id,
        viewBox: "0 0 8 8",
        refX: 7,
        refY: 4,
        markerWidth: 4.9,
        markerHeight: 4.9,
        orient: "auto-start-reverse",
        markerUnits: "strokeWidth",
      });
      marker.append(createSvgElement("path", {
        d: "M 0 0 L 8 4 L 0 8 z",
        fill,
      }));
      definitions.append(marker);
    });
    svg.prepend(definitions);
  }

  function edgeSectionPath(section) {
    const points = [section.startPoint, ...(section.bendPoints || []), section.endPoint];
    return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  }

  function renderEdges(layoutGraph, viewport) {
    const edgeLayer = createSvgElement("g", { class: "graph-edges" });

    for (const edge of layoutGraph.edges || []) {
      for (const section of edge.sections || []) {
        edgeLayer.append(createSvgElement("path", {
          class: "graph-edge",
          d: edgeSectionPath(section),
          "data-edge-id": edge.id,
          "data-edge-source": edge.sources[0],
          "data-edge-target": edge.targets[0],
          "marker-end": "url(#dependency-arrow)",
        }));
      }
    }

    viewport.append(edgeLayer);
  }

  function wrapTitle(title, maximumCharacters = 22, maximumLines = 3) {
    const words = title.trim().split(/\s+/);
    const lines = [];
    let currentLine = "";

    for (const word of words) {
      const candidate = currentLine ? `${currentLine} ${word}` : word;

      if (candidate.length <= maximumCharacters || currentLine === "") {
        currentLine = candidate;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    if (lines.length > maximumLines) {
      const retained = lines.slice(0, maximumLines);
      retained[maximumLines - 1] = `${retained[maximumLines - 1].replace(/[.,;:!?]?$/, "")}…`;
      return retained;
    }

    return lines;
  }

  function renderNodeLabel(node, group) {
    const kindLabel = node.kind === "paper"
      ? `PAPER · ${node.memberCount} NODES`
      : node.kind === "bundle"
        ? `BUNDLE · ${node.memberCount} NODES`
        : node.kind.toUpperCase();
    const kind = createSvgElement("text", {
      class: "graph-node-kind",
      x: node.width / 2,
      y: 18,
    });
    kind.textContent = kindLabel;
    group.append(kind);

    const lines = wrapTitle(node.title);
    const title = createSvgElement("text", {
      class: "graph-node-title",
      x: node.width / 2,
      y: node.height * 0.64 - (lines.length - 1) * 7,
    });

    lines.forEach((line, index) => {
      const lineElement = createSvgElement("tspan", {
        x: node.width / 2,
        dy: index === 0 ? 0 : 14,
      });
      lineElement.textContent = line;
      title.append(lineElement);
    });
    group.append(title);
  }

  function displayedNodeId(view, originalNodeId) {
    if (Array.from(view.expandedBundles.values()).some(
      (expanded) => expanded.bundle.members.includes(originalNodeId),
    )) {
      return originalNodeId;
    }

    return view.visibleGraph.memberToBundle.get(originalNodeId) || originalNodeId;
  }

  function edgeOriginals(view, edgeElement) {
    const visibleEdge = view.visibleEdgeById.get(edgeElement.dataset.edgeId);

    if (visibleEdge) {
      return visibleEdge.originalEdges;
    }

    const originalEdge = view.originalEdgeById.get(edgeElement.dataset.edgeId);
    return originalEdge ? [originalEdge] : [];
  }

  function highlightRelationships(view, selectedNodeId) {
    const { surface, visibleGraph } = view;
    const prerequisiteIds = new Set();
    const dependentIds = new Set();
    const selectedIsOriginalNode = view.graph.nodeById.has(selectedNodeId);

    if (selectedIsOriginalNode) {
      for (const edge of view.graph.edges) {
        if (edge.target === selectedNodeId) {
          prerequisiteIds.add(displayedNodeId(view, edge.source));
        } else if (edge.source === selectedNodeId) {
          dependentIds.add(displayedNodeId(view, edge.target));
        }
      }
    }

    surface.querySelectorAll(".graph-edge").forEach((edge) => {
      edge.classList.remove("is-prerequisite", "is-dependent");

      const originals = edgeOriginals(view, edge);
      const isPrerequisite = selectedIsOriginalNode
        ? originals.some((original) => original.target === selectedNodeId)
        : edge.dataset.edgeTarget === selectedNodeId;
      const isDependent = selectedIsOriginalNode
        ? originals.some((original) => original.source === selectedNodeId)
        : edge.dataset.edgeSource === selectedNodeId;

      if (isPrerequisite) {
        edge.classList.add("is-prerequisite");
        if (!selectedIsOriginalNode) {
          prerequisiteIds.add(edge.dataset.edgeSource);
        }
      } else if (isDependent) {
        edge.classList.add("is-dependent");
        if (!selectedIsOriginalNode) {
          dependentIds.add(edge.dataset.edgeTarget);
        }
      }
    });

    surface.querySelectorAll(".graph-node").forEach((graphNode) => {
      const nodeId = graphNode.dataset.nodeId;
      graphNode.classList.remove("is-selected", "is-prerequisite", "is-dependent");
      graphNode.classList.toggle("is-selected", nodeId === selectedNodeId);
      graphNode.classList.toggle("is-prerequisite", prerequisiteIds.has(nodeId));
      graphNode.classList.toggle("is-dependent", dependentIds.has(nodeId));
    });

    view.expandedBundles.forEach((expanded) => {
      expanded.element.classList.toggle(
        "is-bundle-selected",
        selectedNodeId === expanded.bundle.id,
      );
    });
    view.selectedNodeId = selectedNodeId;

    return {
      prerequisites: selectedIsOriginalNode
        ? view.graph.edges.filter((edge) => edge.target === selectedNodeId)
        : visibleGraph.edges.filter((edge) => edge.target === selectedNodeId),
      dependents: selectedIsOriginalNode
        ? view.graph.edges.filter((edge) => edge.source === selectedNodeId)
        : visibleGraph.edges.filter((edge) => edge.source === selectedNodeId),
    };
  }

  function selectNode(group, surface, node, visibleGraph) {
    const relationships = highlightRelationships(activeView, node.id);
    surface.dispatchEvent(new CustomEvent("mathtrace:node-select", {
      bubbles: true,
      detail: { node, relationships },
    }));
  }

  function applyBundleSelectionStyles(view) {
    const selection = view.bundleSelection;
    view.surface.classList.toggle("is-bundle-selection-mode", Boolean(selection));

    view.surface.querySelectorAll(".graph-node").forEach((graphNode) => {
      const nodeId = graphNode.dataset.nodeId;
      const isOriginalNode = view.graph.nodeById.has(nodeId);
      const isUnavailable = Boolean(selection && isOriginalNode && selection.unavailableNodeIds.has(nodeId));
      const isSelected = Boolean(selection && isOriginalNode && selection.selectedNodeIds.has(nodeId));
      const isSelectableBundle = Boolean(
        selection && !isOriginalNode && selection.selectableBundleIds.has(nodeId),
      );
      const isSelectedBundle = Boolean(
        selection && !isOriginalNode && selection.selectedBundleIds.has(nodeId),
      );
      graphNode.classList.toggle("is-bundle-member-selected", isSelected);
      graphNode.classList.toggle("is-bundle-member-unavailable", isUnavailable);
      graphNode.classList.toggle("is-bundle-selection-anchor", isSelectableBundle);
      graphNode.classList.toggle("is-bundle-absorbed", isSelectedBundle);

      if (selection && (isOriginalNode || isSelectableBundle)) {
        graphNode.setAttribute("aria-pressed", String(isOriginalNode ? isSelected : isSelectedBundle));
      } else {
        graphNode.removeAttribute("aria-pressed");
      }
    });
  }

  function toggleBundleAbsorption(node) {
    const view = activeView;
    const selection = view?.bundleSelection;

    if (!selection || node.kind !== "bundle" || !selection.selectableBundleIds.has(node.id)) {
      return false;
    }

    const selected = !selection.selectedBundleIds.has(node.id);

    if (selected) {
      selection.selectedBundleIds.add(node.id);
    } else {
      selection.selectedBundleIds.delete(node.id);
    }

    applyBundleSelectionStyles(view);
    view.surface.dispatchEvent(new CustomEvent("mathtrace:bundle-toggle", {
      bubbles: true,
      detail: {
        bundleId: node.id,
        selected,
        selectedBundleIds: Array.from(selection.selectedBundleIds),
      },
    }));
    return true;
  }

  function toggleBundleMember(node) {
    const view = activeView;
    const selection = view?.bundleSelection;

    if (!selection || !view.graph.nodeById.has(node.id)) {
      return false;
    }

    if (selection.unavailableNodeIds.has(node.id)) {
      view.surface.dispatchEvent(new CustomEvent("mathtrace:bundle-member-unavailable", {
        bubbles: true,
        detail: { nodeId: node.id },
      }));
      return true;
    }

    const selected = !selection.selectedNodeIds.has(node.id);

    if (selected) {
      selection.selectedNodeIds.add(node.id);
    } else {
      selection.selectedNodeIds.delete(node.id);
    }

    applyBundleSelectionStyles(view);
    view.surface.dispatchEvent(new CustomEvent("mathtrace:bundle-member-toggle", {
      bubbles: true,
      detail: {
        nodeId: node.id,
        selected,
        selectedNodeIds: Array.from(selection.selectedNodeIds),
      },
    }));
    return true;
  }

  function bundleActivationAction(view, node) {
    if (!["bundle", "paper"].includes(node.kind)) {
      return "select";
    }

    if (view.expandedBundles.has(node.id)) {
      return "select";
    }

    return view.selectedNodeId === node.id ? "expand" : "select";
  }

  async function activateNode(group, surface, node, visibleGraph) {
    if (toggleBundleAbsorption(node)) {
      return;
    }

    if (activeView.bundleSelection && ["bundle", "paper"].includes(node.kind)) {
      if (!activeView.expandedBundles.has(node.id)) {
        await expandBundle(node.id);
      }
      return;
    }

    if (toggleBundleMember(node)) {
      return;
    }

    const action = bundleActivationAction(activeView, node);

    if (action === "collapse") {
      collapseBundle(node.id);
      return;
    }

    if (action === "expand") {
      await expandBundle(node.id);
      return;
    }

    selectNode(group, surface, node, visibleGraph);
  }

  function renderNodes(layoutGraph, visibleGraph, viewport, surface) {
    const sourceNodeById = new Map(visibleGraph.nodes.map((node) => [node.id, node]));
    const nodeLayer = createSvgElement("g", { class: "graph-nodes" });

    for (const layoutNode of layoutGraph.children || []) {
      const node = sourceNodeById.get(layoutNode.id);
      const styleKind = nodeStyleKind(node.kind);
      const group = createSvgElement("g", {
        class: `graph-node graph-node--${styleKind}`,
        transform: `translate(${layoutNode.x} ${layoutNode.y})`,
        tabindex: 0,
        role: "button",
        "aria-label": `${node.kind === "paper" ? "Paper" : node.kind === "bundle" ? "Bundle" : node.kind}: ${node.title}`,
        "data-node-id": node.id,
      });
      const accessibleTitle = createSvgElement("title");
      accessibleTitle.textContent = ["bundle", "paper"].includes(node.kind)
        ? `${node.title} (${node.memberCount} nodes). Select, then activate again to expand.`
        : `${node.title} — ${node.kind}`;
      group.append(accessibleTitle);
      group.append(createSvgElement("rect", {
        width: node.width,
        height: node.height,
        rx: 8,
        ry: 8,
      }));
      renderNodeLabel(node, group);
      group.addEventListener("click", (event) => {
        event.stopPropagation();
        activateNode(group, surface, node, visibleGraph).catch((error) => {
          console.error(`MathTrace could not toggle ${node.title}.`, error);
        });
      });
      group.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activateNode(group, surface, node, visibleGraph).catch((error) => {
            console.error(`MathTrace could not toggle ${node.title}.`, error);
          });
        }
      });
      nodeLayer.append(group);
    }

    viewport.append(nodeLayer);
  }

  function renderPaperFrame(layoutGraph, viewport, surface, paperFrame) {
    const paperId = String(paperFrame?.id || "").trim();

    if (!paperId) {
      return;
    }

    const width = Math.max(1, layoutGraph.width || 1);
    const height = Math.max(1, layoutGraph.height || 1);
    const headerHeight = 34;
    const buttonWidth = 98;
    const buttonHeight = 24;
    const group = createSvgElement("g", {
      class: "graph-paper-frame",
      "data-paper-id": paperId,
    });
    group.append(createSvgElement("rect", {
      class: "graph-paper-frame-border",
      x: 1,
      y: 1,
      width: Math.max(1, width - 2),
      height: Math.max(1, height - 2),
      rx: 12,
      ry: 12,
    }));
    group.append(createSvgElement("rect", {
      class: "graph-paper-frame-header",
      x: 1,
      y: 1,
      width: Math.max(1, width - 2),
      height: headerHeight,
      rx: 12,
      ry: 12,
    }));

    const label = createSvgElement("text", {
      class: "graph-paper-frame-id",
      x: 14,
      y: 22,
    });
    label.textContent = paperId;
    group.append(label);

    const collapse = createSvgElement("g", {
      class: "graph-paper-collapse",
      transform: `translate(${Math.max(8, width - buttonWidth - 8)} 6)`,
      tabindex: 0,
      role: "button",
      "aria-label": `Collapse paper ${paperId}`,
    });
    collapse.append(createSvgElement("rect", {
      width: buttonWidth,
      height: buttonHeight,
      rx: 6,
      ry: 6,
    }));
    const collapseLabel = createSvgElement("text", {
      x: buttonWidth / 2,
      y: 16,
      "text-anchor": "middle",
    });
    collapseLabel.textContent = "Collapse paper";
    collapse.append(collapseLabel);
    collapse.addEventListener("pointerdown", (event) => event.stopPropagation());
    collapse.addEventListener("click", (event) => {
      event.stopPropagation();
      surface.dispatchEvent(new CustomEvent("mathtrace:paper-collapse", {
        bubbles: true,
        detail: { paperId },
      }));
    });
    collapse.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        collapse.dispatchEvent(new CustomEvent("click"));
      }
    });
    group.append(collapse);
    viewport.append(group);
  }

  function createBundleElkInput(memberNodes, internalEdges) {
    return {
      id: "expanded-bundle-root",
      layoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": "DOWN",
        "elk.edgeRouting": "ORTHOGONAL",
        "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
        "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
        "elk.layered.spacing.nodeNodeBetweenLayers": "34",
        "elk.spacing.nodeNode": "22",
        "elk.padding": "[top=8,left=8,bottom=8,right=8]",
      },
      children: memberNodes.map((node) => ({
        id: node.id,
        width: BUNDLE_MEMBER_WIDTH,
        height: BUNDLE_MEMBER_HEIGHT,
      })),
      edges: internalEdges.map((edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      })),
    };
  }

  function renderBundleIslandEdges(layoutGraph, island) {
    const edgeLayer = createSvgElement("g", {
      class: "graph-bundle-island-edges",
      transform: `translate(${BUNDLE_ISLAND_PADDING} ${BUNDLE_ISLAND_HEADER + BUNDLE_ISLAND_PADDING})`,
    });

    for (const edge of layoutGraph.edges || []) {
      for (const section of edge.sections || []) {
        edgeLayer.append(createSvgElement("path", {
          class: "graph-edge graph-bundle-internal-edge",
          d: edgeSectionPath(section),
          "data-edge-id": edge.id,
          "data-edge-source": edge.sources[0],
          "data-edge-target": edge.targets[0],
          "marker-end": "url(#dependency-arrow)",
        }));
      }
    }

    island.append(edgeLayer);
  }

  function calculateBundleDragPosition(startPosition, deltaX, deltaY) {
    return {
      x: startPosition.x + deltaX,
      y: startPosition.y + deltaY,
    };
  }

  function positionExpandedBundle(expandedBundle, position) {
    expandedBundle.position = position;
    expandedBundle.element.setAttribute(
      "transform",
      `translate(${expandedBundle.position.x} ${expandedBundle.position.y})`,
    );
  }

  function createBundleDragHandle(view, expandedBundle) {
    const island = expandedBundle.element;
    const handle = createSvgElement("rect", {
      class: "graph-bundle-drag-handle",
      width: Math.max(40, expandedBundle.width - 50),
      height: BUNDLE_ISLAND_HEADER,
      rx: 12,
      ry: 12,
      tabindex: 0,
      role: "button",
      "aria-label": `Move expanded ${expandedBundle.bundle.kind === "paper" ? "paper" : "bundle"} ${expandedBundle.bundle.title}`,
    });
    let drag = null;
    let suppressNextClick = false;
    const dragThreshold = 6;

    island.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || event.target.closest?.(".graph-bundle-control")) {
        return;
      }

      event.stopPropagation();
      drag = {
        pointerId: event.pointerId,
        clientX: event.clientX,
        clientY: event.clientY,
        moved: false,
        captured: false,
        position: { ...expandedBundle.position },
      };
    });
    island.addEventListener("pointermove", (event) => {
      if (!drag || drag.pointerId !== event.pointerId) {
        return;
      }

      const deltaX = event.clientX - drag.clientX;
      const deltaY = event.clientY - drag.clientY;

      if (!drag.moved && Math.hypot(deltaX, deltaY) < dragThreshold) {
        return;
      }

      if (!drag.moved) {
        drag.moved = true;
        island.classList.add("is-dragging");

        if (!drag.captured) {
          island.setPointerCapture?.(event.pointerId);
          drag.captured = true;
        }
      }

      event.preventDefault();
      event.stopPropagation();
      positionExpandedBundle(
        expandedBundle,
        calculateBundleDragPosition(
          drag.position,
          deltaX / view.scale,
          deltaY / view.scale,
        ),
      );
    });
    const finishDrag = (event) => {
      if (!drag || drag.pointerId !== event.pointerId) {
        return;
      }

      event.stopPropagation();
      suppressNextClick = drag.moved;
      drag = null;
      island.classList.remove("is-dragging");

      if (suppressNextClick) {
        window.setTimeout(() => {
          suppressNextClick = false;
        }, 0);
      }
    };
    island.addEventListener("pointerup", finishDrag);
    island.addEventListener("pointercancel", finishDrag);
    island.addEventListener("click", (event) => {
      if (!suppressNextClick) {
        return;
      }

      suppressNextClick = false;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
    handle.addEventListener("keydown", (event) => {
      const distance = (event.shiftKey ? 48 : 16) / view.scale;
      const movement = {
        ArrowLeft: [-distance, 0],
        ArrowRight: [distance, 0],
        ArrowUp: [0, -distance],
        ArrowDown: [0, distance],
      }[event.key];

      if (!movement) {
        return;
      }

      event.preventDefault();
      positionExpandedBundle(
        expandedBundle,
        calculateBundleDragPosition(expandedBundle.position, movement[0], movement[1]),
      );
    });
    expandedBundle.dragHandle = handle;
    expandedBundle.element.append(handle);
  }

  function createBundleCollapseControl(view, island, bundle, islandWidth) {
    const control = createSvgElement("g", {
      class: bundle.kind === "paper"
        ? "graph-bundle-control graph-paper-close"
        : "graph-bundle-control",
      transform: `translate(${islandWidth - 42} 6)`,
      tabindex: 0,
      role: "button",
      "aria-label": bundle.kind === "paper"
        ? `Close and collapse paper ${bundle.title}`
        : `Collapse ${bundle.title}`,
    });
    control.append(createSvgElement("rect", {
      width: 32,
      height: 32,
      rx: 7,
      ry: 7,
    }));
    const label = createSvgElement("text", { x: 16, y: 23 });
    label.textContent = "×";
    control.append(label);
    control.addEventListener("pointerdown", (event) => event.stopPropagation());
    control.addEventListener("click", (event) => {
      event.stopPropagation();
      collapseBundle(bundle.id);
    });
    control.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        collapseBundle(bundle.id);
      }
    });
    island.append(control);
  }

  function renderBundleIslandNodes(view, layoutGraph, memberNodes, island) {
    const memberById = new Map(memberNodes.map((node) => [node.id, node]));
    const nodeLayer = createSvgElement("g", {
      class: "graph-bundle-island-nodes",
      transform: `translate(${BUNDLE_ISLAND_PADDING} ${BUNDLE_ISLAND_HEADER + BUNDLE_ISLAND_PADDING})`,
    });

    for (const layoutNode of layoutGraph.children || []) {
      const node = memberById.get(layoutNode.id);
      const group = createSvgElement("g", {
        class: `graph-node graph-bundle-member graph-node--${nodeStyleKind(node.kind)}`,
        transform: `translate(${layoutNode.x} ${layoutNode.y})`,
        tabindex: 0,
        role: "button",
        "aria-label": `${node.kind}: ${node.title}`,
        "data-node-id": node.id,
      });
      const accessibleTitle = createSvgElement("title");
      accessibleTitle.textContent = `${node.title} — ${node.kind}`;
      group.append(accessibleTitle);
      group.append(createSvgElement("rect", {
        width: BUNDLE_MEMBER_WIDTH,
        height: BUNDLE_MEMBER_HEIGHT,
        rx: 8,
        ry: 8,
      }));
      renderNodeLabel({
        ...node,
        width: BUNDLE_MEMBER_WIDTH,
        height: BUNDLE_MEMBER_HEIGHT,
      }, group);
      group.addEventListener("click", (event) => {
        event.stopPropagation();
        if (!toggleBundleMember(node)) {
          selectNode(group, view.surface, node, view.visibleGraph);
        }
      });
      group.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (!toggleBundleMember(node)) {
            selectNode(group, view.surface, node, view.visibleGraph);
          }
        }
      });
      nodeLayer.append(group);
    }

    island.append(nodeLayer);
  }

  function removeExpandedBundle(view, bundleId) {
    const previous = view.expandedBundles.get(bundleId);

    if (!previous) {
      return null;
    }

    previous.element.remove();
    previous.anchor.classList.remove("is-bundle-expanded");
    view.expandedBundles.delete(bundleId);
    return previous;
  }

  async function expandBundle(bundleId) {
    const view = activeView;

    if (!view) {
      throw new Error("Load a paper before expanding a bundle.");
    }

    if (view.expandedBundles.has(bundleId)) {
      return view.expandedBundles.get(bundleId).bundle;
    }

    const bundle = view.visibleGraph.nodes.find((node) => (
      node.id === bundleId && ["bundle", "paper"].includes(node.kind)
    ));

    if (!bundle) {
      throw new Error(`The bundle ${bundleId} is not visible in the current graph.`);
    }

    const memberSet = new Set(bundle.members);
    const memberNodes = bundle.members.map((memberId) => view.graph.nodeById.get(memberId));
    const internalEdges = view.graph.edges.filter((edge) => (
      memberSet.has(edge.source) && memberSet.has(edge.target)
    ));
    const localLayout = await elk.layout(createBundleElkInput(memberNodes, internalEdges));
    const anchorLayout = view.layoutNodeById.get(bundle.id);
    const anchor = Array.from(view.surface.querySelectorAll(".graph-node"))
      .find((candidate) => candidate.dataset.nodeId === bundle.id);
    const islandWidth = (localLayout.width || BUNDLE_MEMBER_WIDTH) + 2 * BUNDLE_ISLAND_PADDING;
    const islandHeight = (localLayout.height || BUNDLE_MEMBER_HEIGHT)
      + BUNDLE_ISLAND_HEADER
      + 2 * BUNDLE_ISLAND_PADDING;
    const anchorCenterX = anchorLayout.x + BUNDLE_WIDTH / 2;
    const anchorCenterY = anchorLayout.y + BUNDLE_HEIGHT / 2;
    const islandX = anchorLayout.x + BUNDLE_WIDTH + 28;
    const islandY = anchorCenterY - islandHeight / 2;
    const island = createSvgElement("g", {
      class: "graph-bundle-island",
      "data-bundle-id": bundle.id,
    });
    const expandedBundle = {
      anchor,
      bundle,
      element: island,
      internalEdges,
      layout: localLayout,
      position: { x: islandX, y: islandY },
      width: islandWidth,
      height: islandHeight,
    };
    island.append(createSvgElement("rect", {
      class: "graph-bundle-island-background",
      width: islandWidth,
      height: islandHeight,
      rx: 12,
      ry: 12,
    }));
    island.append(createSvgElement("path", {
      class: bundle.kind === "paper"
        ? "graph-bundle-island-header graph-paper-island-header"
        : "graph-bundle-island-header",
      d: `M 12 0 H ${islandWidth - 12} Q ${islandWidth} 0 ${islandWidth} 12 V ${BUNDLE_ISLAND_HEADER} H 0 V 12 Q 0 0 12 0 Z`,
    }));
    createBundleDragHandle(view, expandedBundle);
    island.append(createSvgElement("line", {
      class: "graph-bundle-island-divider",
      x1: 0,
      x2: islandWidth,
      y1: BUNDLE_ISLAND_HEADER,
      y2: BUNDLE_ISLAND_HEADER,
    }));
    const title = createSvgElement("text", {
      class: bundle.kind === "paper"
        ? "graph-bundle-island-title graph-paper-island-id"
        : "graph-bundle-island-title",
      x: 16,
      y: bundle.kind === "paper" ? 28 : 34,
    });
    title.textContent = bundle.kind === "paper" ? bundle.paperId : bundle.title;

    if (bundle.kind === "paper") {
      island.append(title);
    } else {
      const kindLabel = createSvgElement("text", {
        class: "graph-bundle-island-kind",
        x: 16,
        y: 17,
      });
      kindLabel.textContent = `EXPANDED BUNDLE · ${bundle.memberCount} NODES`;
      island.append(kindLabel, title);
    }
    renderBundleIslandEdges(localLayout, island);
    renderBundleIslandNodes(view, localLayout, memberNodes, island);
    createBundleCollapseControl(view, island, bundle, islandWidth);
    view.viewport.append(island);
    anchor.classList.add("is-bundle-expanded");
    view.expandedBundles.set(bundle.id, expandedBundle);
    positionExpandedBundle(expandedBundle, expandedBundle.position);
    applyBundleSelectionStyles(view);
    view.surface.dispatchEvent(new CustomEvent("mathtrace:bundle-state-change", {
      bubbles: true,
      detail: {
        expandedBundleId: bundle.id,
        expandedBundleIds: Array.from(view.expandedBundles.keys()),
      },
    }));
    selectNode(anchor, view.surface, bundle, view.visibleGraph);
    return bundle;
  }

  function collapseBundle(bundleId) {
    const view = activeView;

    if (!view?.expandedBundles.has(bundleId)) {
      return false;
    }

    const { anchor, bundle } = view.expandedBundles.get(bundleId);
    removeExpandedBundle(view, bundleId);
    view.surface.dispatchEvent(new CustomEvent("mathtrace:bundle-state-change", {
      bubbles: true,
      detail: {
        collapsedBundleId: bundle.id,
        expandedBundleId: null,
        expandedBundleIds: Array.from(view.expandedBundles.keys()),
      },
    }));
    selectNode(anchor, view.surface, bundle, view.visibleGraph);
    anchor.focus({ preventScroll: true });
    return true;
  }

  function applyTransform(view) {
    view.viewport.setAttribute(
      "transform",
      `translate(${view.x} ${view.y}) scale(${view.scale})`,
    );

    if (view.zoomLevel) {
      view.zoomLevel.textContent = `${Math.round(view.scale * 100)}%`;
    }
  }

  function graphContentBounds(view) {
    const bounds = {
      minX: 0,
      minY: 0,
      maxX: view.layoutWidth,
      maxY: view.layoutHeight,
    };

    view.expandedBundles.forEach((expanded) => {
      bounds.minX = Math.min(bounds.minX, expanded.position.x);
      bounds.minY = Math.min(bounds.minY, expanded.position.y);
      bounds.maxX = Math.max(bounds.maxX, expanded.position.x + expanded.width);
      bounds.maxY = Math.max(bounds.maxY, expanded.position.y + expanded.height);
    });

    return bounds;
  }

  function fitGraph(view) {
    const surfaceWidth = view.surface.clientWidth || 800;
    const surfaceHeight = view.surface.clientHeight || 700;
    const horizontalPadding = 52;
    const verticalPadding = 52;
    const bounds = graphContentBounds(view);
    const contentWidth = Math.max(1, bounds.maxX - bounds.minX);
    const contentHeight = Math.max(1, bounds.maxY - bounds.minY);
    view.scale = Math.min(
      Math.max(1, surfaceWidth - horizontalPadding) / contentWidth,
      Math.max(1, surfaceHeight - verticalPadding) / contentHeight,
      1.2,
    );
    view.scale = Math.max(MIN_SCALE, view.scale);
    view.x = (surfaceWidth - contentWidth * view.scale) / 2 - bounds.minX * view.scale;
    view.y = (surfaceHeight - contentHeight * view.scale) / 2 - bounds.minY * view.scale;
    applyTransform(view);
  }

  function calculateZoomTransform(view, factor, originX, originY) {
    const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, view.scale * factor));
    const graphX = (originX - view.x) / view.scale;
    const graphY = (originY - view.y) / view.scale;

    return {
      x: originX - graphX * scale,
      y: originY - graphY * scale,
      scale,
    };
  }

  function zoomAt(view, factor, originX, originY) {
    const transform = calculateZoomTransform(view, factor, originX, originY);
    view.x = transform.x;
    view.y = transform.y;
    view.scale = transform.scale;
    applyTransform(view);
  }

  function wheelZoomFactor(event) {
    const unit = event.deltaMode === 1 ? 0.05 : event.deltaMode === 2 ? 1 : 0.002;
    const pinchMultiplier = event.ctrlKey ? 10 : 1;
    return Math.pow(2, -event.deltaY * unit * pinchMultiplier);
  }

  function localPointerPosition(view, event) {
    const bounds = view.surface.getBoundingClientRect();
    return {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
  }

  function preferredZoomOrigin(view) {
    if (view.pointerInside) {
      return { x: view.pointerX, y: view.pointerY };
    }

    return {
      x: (view.surface.clientWidth || 800) / 2,
      y: (view.surface.clientHeight || 700) / 2,
    };
  }

  function installInteractions(view) {
    const abortController = new AbortController();
    const options = { signal: abortController.signal };
    view.abortController = abortController;

    const handleWheel = (event) => {
      event.preventDefault();
      const pointer = localPointerPosition(view, event);
      zoomAt(view, wheelZoomFactor(event), pointer.x, pointer.y);
    };
    view.svg.addEventListener("wheel", handleWheel, { passive: false });
    abortController.signal.addEventListener("abort", () => {
      view.svg.removeEventListener("wheel", handleWheel);
    }, { once: true });

    view.svg.addEventListener("pointermove", (event) => {
      const pointer = localPointerPosition(view, event);
      view.pointerInside = true;
      view.pointerX = pointer.x;
      view.pointerY = pointer.y;
    }, options);
    view.svg.addEventListener("pointerleave", () => {
      view.pointerInside = false;
    }, options);

    view.toolbar.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    }, options);

    view.surface.addEventListener("pointerdown", (event) => {
      const interactionTarget = event.target.closest?.(
        ".node-editor-view, .linked-node-preview, .graph-node, .graph-toolbar, .graph-bundle-island, button, input, textarea, select, a, [role='button'], [contenteditable]",
      );

      if (
        event.button !== 0
        || view.surface.classList.contains("is-paper-card")
        || interactionTarget
      ) {
        return;
      }

      view.pointerId = event.pointerId;
      view.lastPointerX = event.clientX;
      view.lastPointerY = event.clientY;
      view.surface.setPointerCapture(event.pointerId);
      view.surface.classList.add("is-panning");
    }, options);

    view.surface.addEventListener("pointermove", (event) => {
      if (view.pointerId !== event.pointerId) {
        return;
      }

      view.x += event.clientX - view.lastPointerX;
      view.y += event.clientY - view.lastPointerY;
      view.lastPointerX = event.clientX;
      view.lastPointerY = event.clientY;
      applyTransform(view);
    }, options);

    const finishPan = (event) => {
      if (view.pointerId !== event.pointerId) {
        return;
      }

      view.pointerId = null;
      view.surface.classList.remove("is-panning");
    };
    view.surface.addEventListener("pointerup", finishPan, options);
    view.surface.addEventListener("pointercancel", finishPan, options);

    view.toolbar.addEventListener("click", (event) => {
      const button = event.target.closest("[data-graph-action]");

      if (!button) {
        return;
      }

      const action = button.dataset.graphAction;

      if (action === "fit") {
        fitGraph(view);
      } else {
        const origin = preferredZoomOrigin(view);
        zoomAt(
          view,
          action === "zoom-in" ? 1.2 : 1 / 1.2,
          origin.x,
          origin.y,
        );
      }
    }, options);
  }

  async function render({
    surface,
    svg,
    viewport,
    toolbar,
    emptyState,
    graph,
    state = null,
    paperFrame = null,
  }) {
    if (activeView?.abortController) {
      activeView.abortController.abort();
    }

    const visibleGraph = buildVisibleGraph(graph);
    const elkInput = createElkInput(visibleGraph, graph.layout);
    const layoutGraph = await elk.layout(elkInput);
    viewport.replaceChildren();
    svg.querySelectorAll("defs").forEach((definition) => definition.remove());
    createMarkerDefinitions(svg);
    renderEdges(layoutGraph, viewport);
    renderNodes(layoutGraph, visibleGraph, viewport, surface);
    renderPaperFrame(layoutGraph, viewport, surface, paperFrame);

    const view = {
      surface,
      svg,
      viewport,
      toolbar,
      zoomLevel: toolbar.querySelector("#graph-zoom-level"),
      graph,
      visibleGraph,
      layoutGraph,
      layoutNodeById: new Map((layoutGraph.children || []).map((node) => [node.id, node])),
      visibleEdgeById: new Map(visibleGraph.edges.map((edge) => [edge.id, edge])),
      originalEdgeById: new Map(graph.edges.map((edge) => [edge.id, edge])),
      layoutWidth: layoutGraph.width || 1,
      layoutHeight: layoutGraph.height || 1,
      x: 0,
      y: 0,
      scale: 1,
      pointerId: null,
      pointerInside: false,
      pointerX: 0,
      pointerY: 0,
      expandedBundles: new Map(),
      selectedNodeId: null,
      bundleSelection: null,
    };
    activeView = view;
    hideElement(emptyState);
    showElement(svg);
    showElement(toolbar);
    surface.classList.add("has-graph");
    installInteractions(view);

    if (
      state
      && Number.isFinite(state.x)
      && Number.isFinite(state.y)
      && Number.isFinite(state.scale)
    ) {
      view.x = state.x;
      view.y = state.y;
      view.scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, state.scale));
      applyTransform(view);
    } else {
      fitGraph(view);
    }

    const restorableExpandedIds = state?.expandedBundleIds
      || (state?.expandedBundleId ? [state.expandedBundleId] : []);

    for (const bundleId of restorableExpandedIds) {
      try {
        await expandBundle(bundleId);
        const expanded = view.expandedBundles.get(bundleId);
        const savedPosition = state?.expandedBundlePositions?.[bundleId]
          || (bundleId === state?.expandedBundleId ? state.expandedBundlePosition : null);

        if (savedPosition && expanded) {
          positionExpandedBundle(expanded, savedPosition);
        }
      } catch (error) {
        console.warn(`Could not restore expanded group ${bundleId}.`, error);
      }
    }

    if (state?.selectedNodeId) {
      selectNodeById(state.selectedNodeId);
    }

    return {
      visibleNodeCount: visibleGraph.nodes.length,
      visibleEdgeCount: visibleGraph.edges.length,
      collapsedBundleCount: visibleGraph.collapsedBundleCount,
      layoutWidth: view.layoutWidth,
      layoutHeight: view.layoutHeight,
    };
  }

  function selectNodeById(nodeId) {
    if (!activeView) {
      return false;
    }

    if (activeView.expandedBundles.has(nodeId)) {
      const { bundle, dragHandle } = activeView.expandedBundles.get(nodeId);
      const relationships = highlightRelationships(activeView, bundle.id);
      activeView.surface.dispatchEvent(new CustomEvent("mathtrace:node-select", {
        bubbles: true,
        detail: { node: bundle, relationships },
      }));
      dragHandle?.focus({ preventScroll: true });
      return true;
    }

    const expandedContainingNode = Array.from(activeView.expandedBundles.values())
      .find((expanded) => expanded.bundle.members.includes(nodeId));
    let visibleNode = expandedContainingNode
      ? activeView.graph.nodeById.get(nodeId)
      : activeView.visibleGraph.nodes.find((node) => node.id === nodeId);

    if (!visibleNode) {
      visibleNode = activeView.visibleGraph.nodes.find((node) => (
        ["bundle", "paper"].includes(node.kind) && node.members.includes(nodeId)
      ));
    }

    if (!visibleNode) {
      return false;
    }

    const group = Array.from(activeView.surface.querySelectorAll(".graph-node"))
      .find((candidate) => candidate.dataset.nodeId === visibleNode.id);

    if (!group) {
      return false;
    }

    selectNode(group, activeView.surface, visibleNode, activeView.visibleGraph);
    group.focus({ preventScroll: true });
    return true;
  }

  function getState() {
    if (!activeView) {
      return null;
    }

    return {
      x: activeView.x,
      y: activeView.y,
      scale: activeView.scale,
      selectedNodeId: activeView.selectedNodeId,
      expandedBundleId: Array.from(activeView.expandedBundles.keys())[0] || null,
      expandedBundleIds: Array.from(activeView.expandedBundles.keys()),
      expandedBundlePosition: activeView.expandedBundles.size === 1
        ? { ...Array.from(activeView.expandedBundles.values())[0].position }
        : null,
      expandedBundlePositions: Object.fromEntries(
        Array.from(activeView.expandedBundles.entries()).map(([bundleId, expanded]) => (
          [bundleId, { ...expanded.position }]
        )),
      ),
    };
  }

  function updateNodeRecord(node) {
    if (!activeView || !node?.id) {
      return false;
    }

    const graphNode = activeView.graph.nodeById.get(node.id);

    if (graphNode) {
      Object.assign(graphNode, node);
    }

    const visibleNode = activeView.visibleGraph.nodes.find((candidate) => (
      candidate.id === node.id && !["bundle", "paper"].includes(candidate.kind)
    ));

    if (visibleNode) {
      const { width, height } = visibleNode;
      Object.assign(visibleNode, node, { width, height });
    }

    return Boolean(graphNode || visibleNode);
  }

  function setBundleSelectionMode({
    selectedNodeIds = [],
    unavailableNodeIds = [],
    selectedBundleIds = [],
    selectableBundleIds = [],
  } = {}) {
    if (!activeView) {
      return false;
    }

    activeView.bundleSelection = {
      selectedNodeIds: new Set(selectedNodeIds),
      unavailableNodeIds: new Set(unavailableNodeIds),
      selectedBundleIds: new Set(selectedBundleIds),
      selectableBundleIds: new Set(selectableBundleIds),
    };
    applyBundleSelectionStyles(activeView);
    return true;
  }

  function updateBundleSelection(selection = {}) {
    if (!activeView?.bundleSelection) {
      return false;
    }

    const normalized = Array.isArray(selection)
      ? { selectedNodeIds: selection }
      : selection;
    activeView.bundleSelection.selectedNodeIds = new Set(normalized.selectedNodeIds || []);
    activeView.bundleSelection.selectedBundleIds = new Set(normalized.selectedBundleIds || []);
    applyBundleSelectionStyles(activeView);
    return true;
  }

  function clearBundleSelectionMode() {
    if (!activeView) {
      return false;
    }

    activeView.bundleSelection = null;
    applyBundleSelectionStyles(activeView);
    return true;
  }

  function getBundleSelectionState() {
    if (!activeView?.bundleSelection) {
      return null;
    }

    return {
      selectedNodeIds: Array.from(activeView.bundleSelection.selectedNodeIds),
      unavailableNodeIds: Array.from(activeView.bundleSelection.unavailableNodeIds),
      selectedBundleIds: Array.from(activeView.bundleSelection.selectedBundleIds),
      selectableBundleIds: Array.from(activeView.bundleSelection.selectableBundleIds),
    };
  }

  globalScope.MathTraceGraphView = Object.freeze({
    bundleActivationAction,
    buildVisibleGraph,
    calculateBundleDragPosition,
    calculateZoomTransform,
    graphContentBounds,
    clearBundleSelectionMode,
    collapseBundle,
    createBundleElkInput,
    createElkInput,
    expandBundle,
    getBundleSelectionState,
    getState,
    isBundleExpanded(bundleId) {
      return activeView?.expandedBundles.has(bundleId) || false;
    },
    render,
    selectNodeById,
    setBundleSelectionMode,
    updateNodeRecord,
    updateBundleSelection,
  });
}(globalThis));
