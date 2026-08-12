---
id: sacg.one-by-one-classification
kind: example
title: Classification of one-by-one matrix realizations
requires:
  - sacg.matrix-realization
source:
  paper: matrix-method.paper
  section: matrix-method.preliminaries
---

# Main Content

Let $n\in\mathbb{Z}$, and let $X_n=(n)^{\mathrm{SACG}}$ be the standardized abelian Cayley graph realized by the $1\times1$ matrix $(n)$.
Then $X_n = \operatorname{Cay}\left(\mathbb{Z}/n\mathbb{Z},\{\pm1+n\mathbb{Z}\}\right)$.

The graph $X_n$ is classified as follows:
\[
X_n \cong
\begin{cases}
  \text{the doubly infinite path} & \text{if }n=0,\\
  \text{a single vertex with a loop} & \text{if }|n|=1,\\
  K_2 & \text{if }|n|=2,\\
  C_{|n|} & \text{if }|n|\geq3.
\end{cases}
\]

## Proof

The column of $(n)$ generates the subgroup $n\mathbb{Z}$ of $\mathbb{Z}$.

Therefore, the quotient group underlying $X_n$ is $\mathbb{Z}/n\mathbb{Z}$, and two cosets are adjacent when their difference is congruent to $1$ or $-1$ modulo $n$.

If $n=0$, then $n\mathbb{Z}=\{0\}$, so the vertices are the integers and consecutive integers are adjacent.

If $|n|=1$, then the quotient group is trivial and the image of $1$ is the identity, producing a loop at the unique vertex.

If $|n|=2$, then the quotient group has two elements and the images of $1$ and $-1$ coincide, producing a single edge.

If $|n|\geq3$, then each residue class is adjacent to the residue classes immediately before and after it, producing the cycle $C_{|n|}$.

## Use in this paper

The cases $(0)^{\mathrm{SACG}}$ and $(2)^{\mathrm{SACG}}$ are used as bipartite target graphs.

For $|n|\geq3$, the graph $(n)^{\mathrm{SACG}}$ is a cycle and therefore has chromatic number at most $3$.