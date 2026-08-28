# MathTrace project model

The supported authoring unit is a native MathTrace paper folder. Its required paper manifest and Markdown nodes normalize into one internal project before the graph or reader uses it.

```text
MathTraceProject
  format: "mathtrace-project"
  version: 1
  instanceId: runtime-only identifier for this open copy
  paperId: stable identifier supplied by mathtrace.paper.md
  source: { kind: "native-folder", name }
  paper: normalized paper metadata and overview Markdown
  configuration: viewer defaults (nodes/ plus graph layout)
  nodeFiles: normalized paths and source text
  demoFiles: optional executable scripts, stylesheets, and assets
  graph: validated nodes and dependencies
  files: the source files needed for later export
  defaults: original manifest and node files used to detect edits
```

## Identity

`paperId` and `instanceId` serve different purposes.

- `paperId` is stable across downloads and future sessions. It provides the paper namespace.
- `instanceId` distinguishes two open copies of the same paper in one browser session. It is generated at load time and is never exported.
- A node is native when its ID begins with `paperId.`. Any other ID identifies an imported node copied from another paper and is shown with a dashed border.

For example, a node may keep the ID `matrix-method.heuberger-matrix` while moving from `nodes/method/` to another organizational folder. This keeps dependency references stable while allowing the file tree to evolve.

## Paper dependency graph

Each loaded project becomes one paper node in the workspace. The paper node derives its identity and overview from `mathtrace.paper.md`; its internal mathematical nodes remain hidden until the paper is opened.

Suppose paper A contains an imported node with ID `paper-b.result`. If a loaded paper with ID `paper-b` contains that exact ID as a native node, the workspace graph receives an edge from B to A. Several imported nodes from the same provider produce one paper-level edge. An imported snapshot whose source is not loaded remains valid inside A but creates no unresolved or inferred workspace edge.

The paper dependency graph is rebuilt and fitted whenever another paper is loaded. This lets a newly loaded source paper resolve existing imported nodes immediately.

Opening a paper snapshots the paper dependency graph's camera. Closing the paper rebuilds the paper graph but restores that saved pan and zoom, so navigation through a large cross-paper graph does not lose its place.

If creating, editing, or deleting a node changes a cross-paper dependency, the saved camera is invalidated. Returning to the paper dependency graph then rebuilds and fits it so the new topology is visible.

Papers remain self-contained modules. To use a node from another paper, copy that node and its transitive prerequisites into the consuming paper without changing their IDs. This loads only the required mathematical material, avoids an implicit whole-paper dependency, and leaves every imported node visibly attributed by its namespace.

## View modes

Selecting a paper node displays the paper overview. Double-clicking it replaces the workspace graph with that paper's internal dependency graph and fits the graph to the panel. The keyboard equivalent is pressing Enter while the paper node is focused.

Only one paper is open at a time. Its internal graph is drawn directly in the graph panel rather than inside a movable window. **Create node** is available only in this mode and targets the open paper. **Close paper** returns to the rebuilt paper dependency graph with its previous camera restored.

## Structural authorship

A MathTrace graph is not a table of contents and not a paragraph map. It is a distilled model of the paper's mathematical structure. Nodes should be coherent ideas and edges should record direct mathematical prerequisites.

When revising a graph:

1. identify the main definitions, constructions, examples, and results;
2. keep a result with its proof unless the proof contains a genuinely reusable result;
3. merge fragments that cannot be understood independently;
4. omit connective prose that does not carry a mathematical idea;
5. infer dependencies from mathematical use, not only citations and `\ref` commands;
6. inspect the rendered graph and revise until its major routes correspond to the conceptual architecture of the paper.

The rendered dependency graph should guide revision. Dense clusters may reveal which overly granular nodes belong to one larger idea, while long unsupported jumps may reveal a missing prerequisite.

## Editing and compatibility

Node edits and newly created nodes rebuild the open paper's validated graph while preserving compatible pan, zoom, bundle expansion, and selection state. Renaming a node migrates dependency references, internal node links, and paper-overview links while retaining the original file path. Newly created nodes are assigned to `nodes/newly-added/`.

The Papers menu compares the live manifest and node files with their original snapshots. It marks each open paper Edited or Unedited and exports the live project as a ZIP containing `mathtrace.paper.md`, the original node folder structure, browser-created nodes beneath `newly-added/`, and any original files beneath `demos/`.
