---
id: sacg.zero-row-deletion
kind: lemma
title: Zero-row deletion
requires:
  - sacg.invariance.matrix-invariants
  - sacg.isomorphisms.matrix-isomorphisms
  - sacg.block-diagonal-chromatic-number
  - sacg.one-by-one-classification
source:
  paper: matrix-method.paper
  section: matrix-method.basal-chromatic-results
---

# Main Content

Let $X$ be a standardized abelian Cayley graph with finite chromatic number, and let $M_X$ be an $m\times r$ Heuberger matrix with $m\geq 2$.
Suppose that one row of $M_X$ is zero.
Let $M_{X'}$ be the matrix obtained by deleting this row, and let $X'$ be the standardized abelian Cayley graph represented by $M_{X'}$.
Then
\[\chi(X)=\chi(X').\]

## Proof

By statement (1) of [[sacg.isomorphisms.matrix-isomorphisms]], we may move the zero row to the bottom of $M_X$ without changing the graph up to isomorphism.
The resulting matrix has the form
\[
\begin{pmatrix}
    M_{X'}\\
    0
\end{pmatrix}.
\]
Append a zero column to obtain
\[
\widetilde M=
\begin{pmatrix}
    M_{X'} & 0\\
    0 & 0
\end{pmatrix}
= M_{X'}\oplus(0).
\]
Appending this column does not change the realized graph by statement (4) of [[sacg.invariance.matrix-invariants]], applied in reverse.
Therefore, $X$ is isomorphic to the graph represented by $\widetilde M$.

By statement (3) of [[sacg.isomorphisms.matrix-isomorphisms]], this graph is isomorphic to $X'\square (0)^{\mathrm{SACG}}$.

In particular, a layer obtained by fixing a vertex of $(0)^{\mathrm{SACG}}$ is isomorphic to $X'$. Since $\chi(X)$ is finite, it follows that $\chi(X')$ is also finite.

By [[sacg.one-by-one-classification]], the graph $(0)^{\mathrm{SACG}}$ is a doubly infinite path and has chromatic number $2$.

Hence,

\[
\chi(X)=\max\{\chi(X'),2\}.
\]

The matrix $M_{X'}$ has at least one row. Since $X'$ has finite chromatic number, it has no loops, so any standard generator produces an edge. Therefore, $\chi(X')\geq 2$.

It follows that $\chi(X)=\chi(X')$.
