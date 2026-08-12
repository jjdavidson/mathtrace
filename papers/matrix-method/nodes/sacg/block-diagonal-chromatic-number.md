---
id: sacg.block-diagonal-chromatic-number
kind: corollary
title: Chromatic number of a block-diagonal Heuberger matrix
requires:
  - sacg.isomorphisms.matrix-isomorphisms
  - graph.cartesian-product-chromatic-number
source:
  paper: matrix-method.paper
  section: matrix-method.basal-chromatic-results
---

# Main Content

Let $X$ and $Y$ be standardized abelian Cayley graphs with finite chromatic numbers and Heuberger matrices $M_X$ and $M_Y$, respectively.
Let $Z$ be the standardized abelian Cayley graph represented by $M_X\oplus M_Y$. Then
\[\chi(Z)=\max\{\chi(X),\chi(Y)\}.\]

## Proof

By statement (3) of [[sacg.isomorphisms.matrix-isomorphisms]], we have $Z\cong X\square Y$.
Therefore, [[graph.cartesian-product-chromatic-number]] gives
\[\chi(Z)=\chi(X\square Y)=\max\{\chi(X),\chi(Y)\}.\]