---
id: sacg.isomorphisms.matrix-isomorphisms
kind: corollary
title: Matrix isomorphisms
requires:
  - sacg.isomorphisms.row-permutation
  - sacg.isomorphisms.row-negation
  - sacg.isomorphisms.block-diagonal-box-product
source:
  paper: matrix-method.paper
  section: matrix-method.preliminaries
---

# Main Content

Let $X$ and $X'$ be standardized abelian Cayley graphs.

1. If $M_{X'}$ is obtained by permuting the rows of $M_X$, then $X\cong X'$.
2. If $M_{X'}$ is obtained by multiplying a row of $M_X$ by $-1$, then $X\cong X'$.
3. Let $X$ and $Y$ be standardized abelian Cayley graphs, and let $Z$ be represented by the matrix direct sum $M_X\oplus M_Y$. Then $Z\cong X\square Y$.

## Proof

Statement (1) follows from [[sacg.isomorphisms.row-permutation]].

Statement (2) follows from [[sacg.isomorphisms.row-negation]].

Statement (3) follows from [[sacg.isomorphisms.block-diagonal-box-product]].