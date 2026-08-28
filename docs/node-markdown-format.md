# MathTrace node Markdown format

Every node is a Markdown file with YAML frontmatter. A node represents one coherent mathematical idea—not one paragraph and not necessarily one LaTeX environment. The dependency graph should distill the mathematical structure of the paper.

## Required frontmatter

| Field | Type | Use |
| --- | --- | --- |
| `id` | Nonempty string | Stable identifier unique within the paper. Prefer a paper-qualified descriptive ID such as `matrix-method.heuberger-matrix`; do not encode the current folder path. |
| `title` | Nonempty string | Human-readable label shown in the graph and reader. This is the node's only display name. |
| `kind` | Nonempty string | Classifies the idea. Store lowercase values and display them in title case. Recommended values appear below. |
| `requires` | List of node IDs | Direct mathematical prerequisites. The list is always present, even when empty. Entries must exist, be unique, and keep the graph acyclic. |

An ID identifies mathematical content, while a path only organizes files. Moving a node between folders must not change its ID. A node belongs to the paper whose ID is the part before its first dot. If another paper needs it, copy the node and all of its required prerequisites into that paper without changing their IDs. The viewer marks these imported nodes with dashed borders.

## Recommended kinds

Use the most specific ordinary mathematical role that fits the node:

- `definition`
- `lemma`
- `proposition`
- `theorem`
- `corollary`
- `construction`
- `example`
- `algorithm`
- `computation`
- `exposition`
- `remark`
- `conjecture`
- `question`

The list is extensible. A theorem, lemma, or proposition normally remains together with its proof, so `proof` is not usually a separate node kind.

### Default graph colors

The dependency graph gives six common mathematical roles restrained, light colors: definitions are blue, lemmas green, propositions teal, corollaries lavender, theorems rose, and examples amber. All other node kinds are white. Selection and dependency highlighting temporarily override these defaults so graph interactions remain unambiguous.

## Optional frontmatter

| Field | Type | Use |
| --- | --- | --- |
| `status` | String | Editorial state such as `draft`, `reviewed`, `final`, or `deprecated`. |
| `tags` | List of strings | Subject labels for filtering and compact display. |
| `source` | Mapping | Provenance such as source filename, section, page, theorem number, DOI, arXiv ID, or label. |
| `citations` | List of strings or mappings | Bibliographic keys or structured citations directly supporting the node. |
| `aliases` | List of strings | Alternative names that may later aid search and link resolution. |
| `related` | List of node IDs | Non-prerequisite connections. Unlike `requires`, these do not create dependency arrows. |
| `contributors` | List of names or mappings | People who authored, reviewed, translated, or substantially revised this node. |
| `ai_assistance` | Mapping | How AI assisted and whether a human reviewed the result. Prefer a structured record over a Boolean. |
| `lean_verified` | Mapping | Formal-verification reference, including a declaration and optionally a repository and commit. Omit it when no verification is known. |
| `superseded_by` | Node ID | Replacement for a deprecated node. |

The current parser retains additional frontmatter in `metadata`. Compact badges for kind, status, subject tags, AI assistance, and Lean verification are part of the intended reader presentation; longer provenance belongs in a metadata detail view.

For example, a reviewed theorem about graph theory that received AI copyediting and has a linked Lean declaration could display the compact row `Theorem` · `Reviewed` · `Graph theory` · `AI · Copyediting` · `Lean verified`.

Recommended structured forms:

```yaml
ai_assistance:
  level: substantive
  model: GPT-5
  human_reviewed: true

lean_verified:
  declaration: MathTrace.MatrixRealization
  repository: https://github.com/example/formalization
  commit: 84d1c28
```

## Body

Everything after the closing `---` is the node body. Begin the mathematical prose directly; do not add a `Main Content` heading. The interface already displays the frontmatter `title` above the body.

The reader also displays the stable node ID directly beneath the title so authors can copy it into `requires` lists and wikilinks while editing other nodes.

Use `$...$` for inline mathematics and `\[...\]` or `$$...$$` for display mathematics. An internal link such as `[[example-paper.standardized-graph]]` displays the target node's title. Use `[[example-paper.standardized-graph|standardized graph]]` for a custom label.

### Inline HTML and demonstrations

Node bodies may contain raw HTML, including controls, Canvas, SVG, inline styles, and inline scripts. Larger demonstrations should put their JavaScript and CSS in the paper's top-level `demos/` directory and reference them with paper-root-relative paths:

```html
<div id="graph-coloring-demo">
  <input type="range" min="3" max="30" value="8">
  <canvas width="720" height="420"></canvas>
</div>

<link rel="stylesheet" href="demos/graph-coloring.css">
<script src="demos/graph-coloring.js"></script>
```

The script runs after the node HTML has been inserted, so it can select the demonstration elements directly. It receives no MathTrace context object. Do not wait for `DOMContentLoaded`, which has already occurred. Scope element IDs and CSS selectors to the demonstration.

Browser modules are also supported. Mark the entry point with `type="module"` and use relative imports for dependencies vendored beneath `demos/`:

```html
<div data-three-dimensional-demo></div>
<script type="module" src="demos/prism.js"></script>
```

```js
import * as THREE from "./vendor/three.module.min.js";
```

Module paths are resolved inside the uploaded paper and continue to work after download or while offline. Bare package imports such as `from "three"` are not resolved; vendor the dependency and use a relative path. Keep the dependency's license and version notice with the vendored files.

MathTrace papers are trusted executable documents. The viewer does not upload paper files, but users should open papers only from trusted sources.

## Granularity

A good node is the smallest chunk that still expresses a complete mathematical idea. Typical nodes are:

- a definition or an inseparable group of definitions;
- a complete example or construction;
- a theorem, lemma, proposition, or corollary together with its proof;
- a computation or algorithm with the explanation required to understand it;
- a multi-paragraph expository argument with one narrative purpose.

Do not split mechanically at paragraph, section, or environment boundaries. Not every sentence of the paper needs a node. Abstracts, introductions, conclusions, acknowledgments, and paper-level motivation belong in `mathtrace.paper.md`; short transitions may remain outside the graph.

The finished dependency graph is an editorial test. It should reveal the main concepts, results, and logical routes through the paper without reproducing the paper line by line. If the graph is noisy or excessively long, first look for fragments that only make sense together and merge them.

## Complete example

```markdown
---
id: example-paper.homomorphism-bound
title: Homomorphisms bound chromatic number
kind: lemma
requires:
  - example-paper.graph-homomorphism
  - example-paper.chromatic-number
status: reviewed
tags:
  - graph theory
source:
  section: graph-homomorphisms
  label: lem:hom-bound
ai_assistance:
  level: copyediting
  human_reviewed: true
---

If there is a graph homomorphism from $X$ to $Y$, then
\[\chi(X) \leq \chi(Y).\]

This uses [[example-paper.graph-homomorphism]] and
[[example-paper.chromatic-number|the chromatic number]].

## Proof

Pull a proper coloring of $Y$ back through the homomorphism.
```

## Browser editing behavior

Open a paper, select an ordinary node, and choose **Edit node** to edit the complete source. A body-only save rerenders the reader without relaying out the graph. A frontmatter save rebuilds and validates the graph while preserving compatible view state. **Create node** is available only while a paper is open and places its starter file beneath that paper's `nodes/newly-added/` directory.

The source editor highlights mathematics delimited by `$...$`, `$$...$$`, `\(...\)`, or `\[...\]` in green without altering the Markdown. In the reader, **Expand panel** lets the selected node cover both workspace panels for large figures and interactive demonstrations; **Shrink panel** restores the dependency-graph split view.

Renaming a node migrates dependency references, `[[node.id]]` links, and paper-overview links without changing the existing file path. Invalid frontmatter, a missing `requires` list, missing prerequisites, duplicate IDs or paths, and dependency cycles are rejected without mutating the working project. Downloads preserve every existing node path; newly created files remain in `newly-added/` until an author reorganizes them outside the browser.
