# `mathtrace.paper.md` manifest

`mathtrace.paper.md` is the required top-level manifest for a native MathTrace paper. It combines paper-wide metadata and prose with the node-discovery and layout settings formerly stored in `mathtrace.init.yaml`. It is not a graph node and does not acquire dependency edges. The viewer displays its Markdown body whenever the paper card is selected.

Put material that describes the work as a whole here rather than forcing it into the dependency graph: title, authors, abstract, introduction, conclusion, acknowledgments, broad motivation, and bibliographic provenance. Ordinary nodes carry the mathematical ideas navigated through dependency edges.

## Required frontmatter

| Field | Type | Use |
| --- | --- | --- |
| `format` | Exact string | Must be `mathtrace-paper`. |
| `version` | Positive integer | Manifest schema version. Use `2`. |
| `id` | Nonempty string | Stable paper identifier and future cross-paper namespace. |
| `title` | Nonempty string | Full display title. |
| `graph` | Mapping | Contains graph-source settings. |
| `graph.nodeDirectory` | Safe relative directory | Directory recursively searched for node `.md` files. Use `nodes` unless another name is necessary. |

`graph.nodeDirectory` cannot be absolute and cannot contain empty, `.`, or `..` path components.

## Optional frontmatter

| Field | Type | Use |
| --- | --- | --- |
| `authors` | List of names or author mappings | Displays authors. A mapping requires `name` and may include `affiliation` and `orcid`. |
| `date` | Nonempty string | Human-readable publication or draft date. |
| `status` | Nonempty string | Paper state such as `draft`, `preprint`, `submitted`, or `published`. |
| `keywords` | List of strings | Subjects for discovery and future filtering. |
| `source` | Mapping | Open provenance such as `doi`, `arxiv`, `journal`, `url`, or an original filename. |
| `layout` | Mapping | Graph layout configuration. |
| `layout.engine` | String | Documents the intended engine. The current viewer uses its vendored ELK renderer. |
| `layout.algorithm` | String | Defaults to `layered`, which is designed for dependency graphs. |
| `layout.direction` | String | Defaults to `DOWN`; common alternatives are `UP`, `LEFT`, and `RIGHT`. |
| `layout.nodePlacementStrategy` | String | Defaults to `NETWORK_SIMPLEX` for layered layout. |
| `bundling` | Mapping | Low-level graph-simplification compatibility settings. A paper cannot contain another paper. |

## Complete example

```markdown
---
format: mathtrace-paper
version: 2
id: example-paper
title: "An Example Paper"
authors:
  - name: Ada Example
    affiliation: Example University
    orcid: 0000-0000-0000-0000
date: "2026"
status: preprint
keywords:
  - graph theory
source:
  doi: 10.0000/example
graph:
  nodeDirectory: nodes
layout:
  engine: elk
  algorithm: layered
  direction: DOWN
  nodePlacementStrategy: NETWORK_SIMPLEX
---

## Abstract

Paper-wide Markdown goes here.

## Introduction

The main result is [[example-paper.main-theorem]].
```

## Body and export

Everything below the frontmatter is rendered with the same Markdown, mathematics, and `[[node.id|optional label]]` rules used for node content. `Abstract`, `Introduction`, and `Conclusion` are ordinary Markdown headings rather than reserved syntax.

The paper download contains this manifest, the `nodes/` directory, and the optional `demos/` directory. Existing node files retain their original relative paths, even after edits or ID changes. Nodes created in the browser are exported beneath `nodes/newly-added/` (or the configured node directory's `newly-added/` subfolder). Files beneath `demos/` retain their original relative paths and bytes.
