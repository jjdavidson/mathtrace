---
id: sacg.invariance.matrix-invariants
kind: corollary
title: Matrix invariants
requires:
  - sacg.invariance.column-permutation
  - sacg.invariance.column-negation
  - sacg.invariance.column-addition
  - sacg.invariance.dependent-column-deletion
source:
  paper: matrix-method.paper
  section: matrix-method.preliminaries
---

# Main Content

Let $X$ and $X'$ be standardized abelian Cayley graphs with Heuberger matrices $M_X$ and $M_{X'}$, respectively.
Each of the following operations leaves the realized graph unchanged.

1. If $M_{X'}$ is obtained by permuting the columns of $M_X$, then $X=X'$.
2. If $M_{X'}$ is obtained by multiplying a column of $M_X$ by $-1$, then $X=X'$.
3. Suppose that $y_i$ and $y_j$ are distinct columns of $M_X$. If $M_{X'}$ is obtained by replacing $y_j$ with $y_j+ay_i$ for some $a\in\mathbb{Z}$, then $X=X'$.
4. If $M_{X'}$ is obtained by deleting a column of $M_X$ that belongs to the $\mathbb{Z}$-span of the remaining columns, then $X=X'$. In particular, deleting a zero column does not change the graph.

## Proof

Statement (1) follows from [[sacg.invariance.column-permutation]].

Statement (2) follows from [[sacg.invariance.column-negation]].

Statement (3) follows from [[sacg.invariance.column-addition]].

Statement (4) follows from [[sacg.invariance.dependent-column-deletion]].