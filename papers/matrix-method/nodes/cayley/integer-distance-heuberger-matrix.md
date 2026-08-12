---
id: cayley.integer-distance-heuberger-matrix
kind: theorem
title: Heuberger matrices for integer-distance graphs
requires:
  - cayley.integer-distance-graph
  - sacg.heuberger-matrix
  - sacg.standardization-isomorphism
source:
  paper: matrix-method.paper
  section: matrix-method.preliminaries
---

# Main Content

Let $a_1,\dots,a_{r+1}$ be positive integers satisfying
\[
\gcd(a_1,\dots,a_{r+1})=1.
\]
Set
\[
g_k=\gcd(a_1,\dots,a_k)
\]
for $k\in\{2,\dots,r+1\}$, so that $g_{r+1}=1$.

For every $k\in\{2,\dots,r\}$, choose integers $u_{1k},\dots,u_{kk}$ satisfying
\[
a_1u_{1k}+\cdots+a_ku_{kk}
=
a_{k+1}\frac{g_k}{g_{k+1}}.
\]
Then the [[cayley.integer-distance-graph|integer-distance graph]]
\[
X=\operatorname{Cay}\bigl(\mathbb{Z},\{\pm a_1,\dots,\pm a_{r+1}\}\bigr)
\]
has the [[sacg.heuberger-matrix|Heuberger matrix]]
\[
M_X=
\begin{pmatrix}
\dfrac{a_2}{g_2} & -u_{12} & -u_{13} & \cdots & -u_{1r}\\
-\dfrac{a_1}{g_2} & -u_{22} & -u_{23} & \cdots & -u_{2r}\\
0 & \dfrac{g_2}{g_3} & -u_{33} & \cdots & -u_{3r}\\
0 & 0 & \dfrac{g_3}{g_4} & \cdots & -u_{4r}\\
\vdots & \vdots & \vdots & \ddots & \vdots\\
0 & 0 & 0 & \cdots & -u_{rr}\\
0 & 0 & 0 & \cdots & g_r
\end{pmatrix}.
\]

Here the omitted entries below the displayed subdiagonal are zero.

## Proof

Define
\[
\phi\colon\mathbb{Z}^{r+1}\longrightarrow\mathbb{Z}
\]
by $\phi(e_i)=a_i$.
The gcd assumption makes $\phi$ surjective.

Every column of $M_X$ belongs to $\ker\phi$.
For the first column this follows from
\[
a_1\frac{a_2}{g_2}-a_2\frac{a_1}{g_2}=0,
\]
and for each subsequent column it follows from the defining equation for the integers $u_{ik}$.

The signed maximal minors of $M_X$ are, up to a common overall sign,
\[
a_1,a_2,\dots,a_{r+1}.
\]
Their gcd is $1$, so the column lattice of $M_X$ is a saturated rank-$r$ subgroup of $\mathbb{Z}^{r+1}$.
It is contained in the rank-$r$ subgroup $\ker\phi$, and therefore the two subgroups are equal.

The [[sacg.standardization-isomorphism|standardization isomorphism]] now gives
\[
X\cong(M_X)^{\mathrm{SACG}}.
\]

## Converse

Let $M$ be an $(r+1)\times r$ integer matrix of rank $r$.
For each $i$, let $M^{(i)}$ be the matrix obtained by deleting row $i$, and define
\[
v_i=(-1)^{i+1}\det M^{(i)}.
\]
If
\[
\gcd(v_1,\dots,v_{r+1})=1,
\]
then
\[
M^{\mathrm{SACG}}
\cong
\operatorname{Cay}\bigl(\mathbb{Z},\{\pm v_1,\dots,\pm v_{r+1}\}\bigr).
\]

Indeed, the generalized cross product $v=(v_1,\dots,v_{r+1})^t$ satisfies $M^tv=0$.
The map $x\mapsto v^tx$ is surjective because $v$ is primitive, and the maximal-minor condition shows that the column lattice of $M$ is exactly its kernel.
