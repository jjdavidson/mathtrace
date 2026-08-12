---
id: cayley.circulant-heuberger-matrix
kind: theorem
title: Heuberger matrices for circulant graphs
requires:
  - cayley.circulant-graph
  - cayley.integer-distance-heuberger-matrix
  - sacg.heuberger-matrix
  - sacg.matrix-realization
source:
  paper: matrix-method.paper
  section: matrix-method.preliminaries
---

# Main Content

Let $a_1,\dots,a_r,n$ be positive integers satisfying
\[
\gcd(a_1,\dots,a_r,n)=1.
\]
Apply [[cayley.integer-distance-heuberger-matrix]] to the list
\[
a_1,\dots,a_r,a_{r+1}=n
\]
and let $B$ be the resulting $(r+1)\times r$ matrix.
Delete the last row of $B$ to obtain an $r\times r$ matrix $M$.
Then $M$ is a [[sacg.heuberger-matrix|Heuberger matrix]] for the [[cayley.circulant-graph|circulant graph]]
\[
C_n(a_1,\dots,a_r)
=
\operatorname{Cay}\bigl(\mathbb{Z}_n,\{\pm a_1,\dots,\pm a_r\}\bigr).
\]

Equivalently, with the notation of the integer-distance construction,
\[
M=
\begin{pmatrix}
\dfrac{a_2}{g_2} & -u_{12} & -u_{13} & \cdots & -u_{1r}\\
-\dfrac{a_1}{g_2} & -u_{22} & -u_{23} & \cdots & -u_{2r}\\
0 & \dfrac{g_2}{g_3} & -u_{33} & \cdots & -u_{3r}\\
0 & 0 & \dfrac{g_3}{g_4} & \cdots & -u_{4r}\\
\vdots & \vdots & \vdots & \ddots & \vdots\\
0 & 0 & 0 & \cdots & -u_{rr}
\end{pmatrix}.
\]

## Proof

Define
\[
\psi\colon\mathbb{Z}^r\longrightarrow\mathbb{Z}_n
\]
by $\psi(e_i)=a_i+n\mathbb{Z}$.
The gcd assumption makes $\psi$ surjective.

The columns of $B$ generate all integer relations among $a_1,\dots,a_r,n$.
Their first $r$ coordinates are the columns of $M$, so every column of $M$ belongs to $\ker\psi$.

Conversely, if $x\in\ker\psi$, then
\[
a_1x_1+\cdots+a_rx_r=qn
\]
for some $q\in\mathbb{Z}$.
The vector $(x_1,\dots,x_r,-q)^t$ is therefore an integer relation among $a_1,\dots,a_r,n$ and is an integer combination of the columns of $B$.
Taking its first $r$ coordinates shows that $x$ is an integer combination of the columns of $M$.
Hence the columns of $M$ generate $\ker\psi$, proving the claim.

## Converse

Let $M$ be an $r\times r$ integer matrix with
\[
N=|\det M|>0.
\]
Delete one column of $M$, and let $v=(v_1,\dots,v_r)^t$ be a signed generalized cross product of the remaining $r-1$ columns.
If
\[
\gcd(v_1,\dots,v_r)=1,
\]
then
\[
M^{\mathrm{SACG}}
\cong
C_N(v_1,\dots,v_r).
\]

The vector $v$ is orthogonal to the retained columns, while its inner product with the deleted column is $\pm\det M$.
Thus the column lattice of $M$ lies in the kernel of the surjective map
\[
\mathbb{Z}^r\longrightarrow\mathbb{Z}_N,
\qquad
x\longmapsto v^tx+N\mathbb{Z}.
\]
Both subgroups have index $N$, so they are equal; [[sacg.matrix-realization]] then identifies the realized graph with the stated circulant graph.
