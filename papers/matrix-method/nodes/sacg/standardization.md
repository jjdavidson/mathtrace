---
id: sacg.standardization
kind: construction
title: Standardization of an abelian Cayley graph
requires:
  - sacg.standardized-abelian-cayley-graph
source:
  paper: matrix-method.paper
  section: matrix-method.preliminaries
---

# Main Content

Let $X=\operatorname{Cay}(G,S)$ be a finite-degree connected abelian Cayley graph, where $G$ is written additively.
Choose elements $g_1,\ldots,g_m\in G$ such that $S=\{\pm g_1,\ldots,\pm g_m\}$.
Define a group homomorphism $\varphi:\mathbb{Z}^m\to G$ by $\varphi(e_i)=g_i$ for each $i\in\{1,\ldots,m\}$.
Equivalently,
\[\varphi(a_1,\ldots,a_m)^t=\sum_{i=1}^m a_i g_i.\]

Since $S$ generates $G$, the map $\varphi$ is surjective.
Let $H=\ker\varphi$.

The *standardization of $X$ relative to $g_1,\ldots,g_m$* is the standardized abelian Cayley graph
\[
X^{\mathrm{std}} =
\operatorname{Cay}\left(\mathbb{Z}^m/H,\{H\pm e_1,\ldots,H\pm e_m\}\right).
\]

The homomorphism $\varphi$ induces a map $\overline{\varphi}:\mathbb{Z}^m/H\to G$, where $H+x\mapsto\varphi(x)$.

## Remark

The construction converts relations among the generators $g_1,\ldots,g_m$ into elements of the subgroup $H$.

Explicitly,
\[(a_1,\ldots,a_m)^t\in H\]
if and only if
\[\sum_{i=1}^m a_i g_i=0\]
in $G$.

The standardization depends on the chosen list $g_1,\ldots,g_m$ and its ordering.
It is therefore a standardized presentation of the graph rather than a unique canonical presentation.

## Use in this paper

The paper restricts attention to finite-degree connected abelian Cayley graphs, so every graph under consideration admits this construction.

The next step is to prove that $\overline{\varphi}$ is a graph isomorphism from $X^{\mathrm{std}}$ to $X$.
Afterward, the subgroup $H$ will be represented by a finite integer matrix whose columns generate $H$.