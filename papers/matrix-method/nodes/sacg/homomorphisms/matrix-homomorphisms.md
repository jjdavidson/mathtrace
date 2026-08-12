---
id: sacg.homomorphisms.matrix-homomorphisms
kind: corollary
title: Matrix homomorphisms
requires:
  - sacg.invariance.matrix-invariants
  - sacg.isomorphisms.matrix-isomorphisms
  - sacg.homomorphisms.column-factor-reduction
  - sacg.homomorphisms.row-sum
  - sacg.homomorphisms.column-append
  - sacg.homomorphisms.zero-row-append
  - graph.homomorphism-composition
source:
  paper: matrix-method.paper
  section: matrix-method.graph-homomorphisms
---

# Main Content

The following transformations of Heuberger matrices produce graph homomorphisms between the corresponding standardized abelian Cayley graphs.

1. Every graph equality in [[sacg.invariance.matrix-invariants]] and every graph isomorphism in [[sacg.isomorphisms.matrix-isomorphisms]] gives graph homomorphisms in both directions.
2. A column may be divided by a common integer factor.
3. Two rows may be collapsed by adding them.
4. An arbitrary column may be appended.
5. A zero row may be appended.
6. Any finite composition of the preceding transformations produces a graph homomorphism.

## Proof

Statement (1) follows because the identity map and every graph isomorphism preserve adjacency, and the inverse of a graph isomorphism also preserves adjacency.

Statement (2) is [[sacg.homomorphisms.column-factor-reduction]].

Statement (3) is [[sacg.homomorphisms.row-sum]].

Statement (4) is [[sacg.homomorphisms.column-append]].

Statement (5) is [[sacg.homomorphisms.zero-row-append]].

Statement (6) follows from [[graph.homomorphism-composition]] by induction on the number of transformations.