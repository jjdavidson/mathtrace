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
  configuration: graph and layout settings parsed from mathtrace.paper.md
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
- Node IDs are stable within a paper and should be paper-qualified when practical. They are independent of folder placement. The canonical form `paper-id::node-id` is reserved for future cross-paper references.

For example, a node may keep the ID `matrix-method.heuberger-matrix` while moving from `nodes/method/` to another organizational folder. This keeps dependency references stable while allowing the file tree to evolve.

## Paper as module

Each loaded project becomes one flat paper container in the shared workspace. Its paper card derives its identity and overview from `mathtrace.paper.md`; its expanded window contains every node in that paper's graph. Papers do not contain nested papers.

Selecting a paper card once displays the paper overview. Selecting that already-selected card again expands its dependency graph. Several papers may remain open, move with workspace pan and zoom, and be repositioned independently. Only the red close control collapses a paper.

The long-term model treats papers as modules in a mathematical ecosystem. Within-paper requirements use the paper's stable node IDs. Cross-paper resolution, shared foundational nodes, and ecosystem manifests are future protocol work; current papers should remain useful when loaded alone.

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

Node edits and newly created nodes rebuild the validated workspace while preserving compatible pan, zoom, paper expansion, paper-window position, and selection state. Renaming a node migrates dependency references, internal node links, and paper-overview links while retaining the original file path. Newly created nodes are assigned to the configured node directory's `newly-added/` subfolder.

The Papers menu compares the live manifest and node files with their original snapshots. It marks each open paper Edited or Unedited and exports the live project as a ZIP containing `mathtrace.paper.md`, the original node folder structure, browser-created nodes beneath `newly-added/`, and any original files beneath `demos/`.
