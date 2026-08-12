---
id: sacg.standardized-abelian-cayley-graph
kind: definition
title: Standardized abelian Cayley graph
requires:
  - cayley.graph
source:
  paper: matrix-method.paper
  section: matrix-method.preliminaries
---

# Main Content

Let $m$ be a positive integer, let $e_1,\ldots,e_m$ be the canonical basis vectors of $\mathbb{Z}^m$, and let $H$ be a subgroup of $\mathbb{Z}^m$.

The *standardized abelian Cayley graph* associated with $H$ is
\[\operatorname{Cay}\left(\mathbb{Z}^m/H,\{H\pm e_1,\ldots,H\pm e_m\}\right).\]

Thus, the underlying group is a quotient of $\mathbb{Z}^m$, and the generating set consists of the images of the canonical basis vectors and their inverses.

## Remark

Every standardized abelian Cayley graph is connected and has finite degree.

Indeed, the cosets $H+e_1,\ldots,H+e_m$ generate $\mathbb{Z}^m/H$, and the graph has degree at most $2m$.

The degree can be less than $2m$ because some of the cosets $H\pm e_i$ may coincide.
If $e_i\in H$ for some $i$, then $H+e_i=H$, and the graph has a loop at every vertex.

## Use in this paper

The paper abbreviates “standardized abelian Cayley graph” as SACG.

Standardization replaces an arbitrary finite symmetric generating set with the images of the canonical basis vectors.
The subgroup $H$ records all additive relations among the original generators.

The paper writes elements of $\mathbb{Z}^m$ as column vectors.