---
id: sacg.heuberger-matrix
kind: definition
title: Heuberger matrix
requires:
  - sacg.standardized-abelian-cayley-graph
source:
  paper: matrix-method.paper
  section: matrix-method.preliminaries
---

# Main Content

Let $X = \operatorname{Cay}\left(\mathbb{Z}^m/H,\{H\pm e_1,\ldots,H\pm e_m\}\right)$ be a standardized abelian Cayley graph.
Choose vectors $y_1,\ldots,y_r\in\mathbb{Z}^m$ such that $H=\langle y_1,\ldots,y_r\rangle$.
The integer matrix
\[
M_X =
\begin{pmatrix}
    \vert & & \vert\\
    y_1 & \cdots & y_r\\
    \vert & & \vert
\end{pmatrix}
\]
is called a *Heuberger matrix* of $X$.

Thus, the columns of $M_X$ generate the subgroup $H$ that determines the quotient group $\mathbb{Z}^m/H$.

The number $m$ of rows is called the *dimension* of the Heuberger matrix.
The number $r$ of columns is called its *rank* in this paper.

## Remark

A Heuberger matrix is not unique.
Different collections of vectors can generate the same subgroup $H$, and therefore different integer matrices can represent the same standardized abelian Cayley graph.
The columns need not form a minimal generating set for $H$.
They may, however, be chosen so that their number equals the rank of the free abelian group $H$.

## Use in this paper

The paper writes $M_X^{\mathrm{SACG}}$ to indicate the standardized abelian Cayley graph represented by the matrix $M_X$.
When the graph does not need to be named, the subscript $X$ may be omitted.

The term “Heuberger matrix” reflects the influence of Heuberger’s use of integer matrices to represent circulant graphs.
Heuberger matrices allow questions about graph isomorphisms, graph homomorphisms, and chromatic numbers to be studied through integer row and column operations.

The next construction reverses this definition by producing a standardized abelian Cayley graph from an arbitrary integer matrix.