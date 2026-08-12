---
id: sacg.colorings.one-column-classification
kind: theorem
title: One-column classification
requires:
  - sacg.colorings.bipartite-criterion
  - sacg.homomorphisms.matrix-homomorphisms
  - sacg.one-by-one-classification
  - graph.homomorphism-chromatic-number
source:
  paper: matrix-method.paper
  section: matrix-method.graph-homomorphisms-and-chromatic-numbers
---

# Main Content

Let $y=(y_1,\dots,y_m)^t\in\mathbb{Z}^m$
and define the standardized abelian Cayley graph $X$ by the one-column Heuberger matrix $(y)^{\mathrm{SACG}}_X$.
If $y=\pm e_j$ for some $j\in\{1,\dots,m\}$, then $X$ has loops and cannot be properly colored.
Otherwise,
\[
\chi(X)=
\begin{cases}
    2, & \text{if $y$ has an even number of odd entries},\\
    3, & \text{if $y$ has an odd number of odd entries}.
\end{cases}
\]

We also refer to this theorem as the Tomato Cage Theorem.

## Proof

If $y=\pm e_j$, then $e_j$ represents the identity element in the quotient group defining $X$.
The corresponding generator therefore produces a loop.

Now suppose that $y\neq\pm e_j$ for every $j$.
The column sum $y_1+\cdots+y_m$ is even if and only if $y$ has an even number of odd entries.
Therefore, [[sacg.colorings.bipartite-criterion]] gives $\chi(X)=2$ exactly when $y$ has an even number of odd entries.

It remains to consider the case in which $y$ has an odd number of odd entries.
Set $s=|y_1|+\cdots+|y_m|$.
The integer $s$ is odd.
Moreover, $s>1$, since an integer vector of $\ell_1$-norm $1$ must equal $\pm e_j$ for some $j$.

By negating rows as needed and then summing all the rows, the operations in [[sacg.homomorphisms.matrix-homomorphisms]] give

\[
\begin{pmatrix}
    y_1\\
    \vdots\\
    y_m
\end{pmatrix}^{\mathrm{SACG}}_X
\cong
\begin{pmatrix}
    |y_1|\\
    \vdots\\
    |y_m|
\end{pmatrix}^{\mathrm{SACG}}
\xrightarrow{\circledcirc}
(s)^{\mathrm{SACG}}_Y.
\]
Because $s\geq3$ is odd, [[sacg.one-by-one-classification]] identifies $Y$ as an odd cycle and gives $\chi(Y)=3$.
Hence [[graph.homomorphism-chromatic-number]] gives $\chi(X)\leq3$.

The column sum of $y$ is odd, so [[sacg.colorings.bipartite-criterion]] shows that $X$ is not bipartite.
Consequently, $\chi(X)=3$.