# `mathtrace.paper.md` manifest

`mathtrace.paper.md` is the required top-level file for a native MathTrace paper. Its frontmatter identifies the paper; its Markdown body contains paper-wide prose such as the abstract, introduction, conclusion, acknowledgments, and publication information. It is not a graph node and has no dependencies.

Keep the frontmatter minimal. MathTrace finds nodes beneath `nodes/` and supplies its own graph-layout defaults.

## Required frontmatter

| Field | Type | Use |
| --- | --- | --- |
| `id` | Paper slug | Stable paper identity and node namespace. Use lowercase letters, digits, and single hyphens; do not use dots. |
| `title` | Nonempty string | Full title shown on the paper node and overview. |
| `authors` | Nonempty list | Each item is either a name or a mapping with `name` and an optional `arxiv` URL. |

An `arxiv` value must be a complete HTTPS URL on `arxiv.org`. When supplied, the author's name links to that page in the paper overview.

## Complete example

```markdown
---
id: example-paper
title: "An Example Paper"
authors:
  - name: Ada Example
    arxiv: "https://arxiv.org/search/math?query=Example,+A&searchtype=author"
  - Emmy Example
---

## Abstract

Paper-wide Markdown goes here.

## Introduction

The main result is [[example-paper.main-theorem]].
```

## Native and imported nodes

A node is native to a paper exactly when its ID begins with the paper ID followed by a dot. Thus `example-paper.main-theorem` is native to `example-paper`, while `foundations.graph-homomorphism` is imported.

When a paper uses a node from another MathTrace paper, copy that node into the consuming paper's `nodes/` directory without changing its ID. Also copy every prerequisite needed to make the dependency graph complete. Do not load or copy the source paper as a whole. Imported nodes are snapshots: the consuming paper controls when to update them.

The viewer draws imported nodes with dashed borders. This makes provenance visible while keeping every paper independently loadable and limited to the mathematical material it actually uses.

When the source paper is also loaded and contains the exact imported node ID natively, MathTrace connects the source paper to the consuming paper in the paper dependency graph. The graph is rebuilt whenever another paper is loaded, so these relationships resolve incrementally.

## Body and export

Everything below the frontmatter is rendered with the same Markdown, mathematics, and `[[node.id|optional label]]` rules used for nodes. Headings such as Abstract, Introduction, and Conclusion are ordinary Markdown headings rather than reserved syntax.

Paper downloads contain this manifest, the `nodes/` directory, and the optional `demos/` directory. Existing paths are preserved. Nodes created in the browser are exported beneath `nodes/newly-added/`. Files beneath `demos/` retain their paths and bytes.
