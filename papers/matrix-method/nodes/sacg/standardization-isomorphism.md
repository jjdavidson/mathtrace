---
id: sacg.standardization-isomorphism
kind: lemma
title: Standardization isomorphism
requires:
  - sacg.standardization
source:
  paper: matrix-method.paper
  section: matrix-method.preliminaries
---

# Main Content

Let $X = \operatorname{Cay}(G,S)$ be a finite-degree connected abelian Cayley graph, where $S=\{\pm g_1,\ldots,\pm g_m\}$.

Let $\varphi:\mathbb{Z}^m\longrightarrow G$ be the homomorphism defined by $\varphi(e_i)=g_i$, and let $H=\ker\varphi$.
Then the induced map $\overline{\varphi}:\mathbb{Z}^m/H\to G$, where $H+x\mapsto\varphi(x)$, is a graph isomorphism from $X^{\mathrm{std}}$ to $X$.

## Proof

First, the map $\overline{\varphi}$ is well-defined.
If $H+x=H+y$, then $x-y\in H=\ker\varphi$.
Therefore,
\[\varphi(x)-\varphi(y)=\varphi(x-y)=0,\]
so $\varphi(x)=\varphi(y)$.

Since $\varphi$ is surjective, the induced map $\overline{\varphi}$ is surjective.
Moreover, $\overline{\varphi}(H+x)=0$ if and only if $\varphi(x)=0$, which holds if and only if $x\in H$.
Thus, the kernel of $\overline{\varphi}$ is trivial, and $\overline{\varphi}$ is a group isomorphism.

It remains to verify that $\overline{\varphi}$ preserves adjacency.
Two vertices $H+x$ and $H+y$ are adjacent in $X^{\mathrm{std}}$ if and only if
\[H+x=H+y\pm e_i\]
for some $i\in\{1,\ldots,m\}$.
This holds if and only if
\[\varphi(x)=\varphi(y)\pm\varphi(e_i)=\varphi(y)\pm g_i.\]
Since $S=\{\pm g_1,\ldots,\pm g_m\}$, this is equivalent to $\varphi(x)$ and $\varphi(y)$ being adjacent in $X$.

Therefore, $\overline{\varphi}$ is a graph isomorphism.

## Remark

Under this isomorphism, the canonical generator $H+e_i$ corresponds to the chosen generator $g_i$.

The result remains valid when some of the generators $\pm g_i$ coincide or when the graph contains loops.

## Use in this paper

This isomorphism allows the paper to replace any finite-degree connected abelian Cayley graph with a standardized abelian Cayley graph without changing its graph-theoretic properties.

In particular,
\[\chi(X^{\mathrm{std}})=\chi(X).\]

The paper subsequently represents the subgroup $H$ by an integer matrix whose columns generate $H$.