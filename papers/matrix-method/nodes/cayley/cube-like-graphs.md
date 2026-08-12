---
id: cayley.cube-like-graphs
kind: definition
title: Cube-like graphs and folded cubes
requires:
  - cayley.graph
  - sacg.standardization-isomorphism
source:
  paper: matrix-method.paper
  section: matrix-method.payans-theorem
---

# Main Content

Let $\mathbb{Z}_2^n$ denote the $n$-dimensional vector space over $\mathbb{Z}_2$. A **cube-like graph** is a Cayley graph of the form
\[X=\operatorname{Cay}(\mathbb{Z}_2^n,S).\]
Cube-like graphs are also called **binary Cayley graphs**.
Because every element of $\mathbb{Z}_2^n$ is its own inverse, every subset $S\subseteq\mathbb{Z}_2^n$ is symmetric.

Let $e_1,\dots,e_n$ be the standard basis vectors, and let
\[w_n=(1,\dots,1)\in\mathbb{Z}_2^n.\]
The **$n$-dimensional cube-with-diagonals graph** is
\[Q_n^d = \operatorname{Cay}\bigl(\mathbb{Z}_2^n,\{e_1,\dots,e_n,w_n\}\bigr).\]
The edges corresponding to $e_1,\dots,e_n$ form the ordinary $n$-dimensional hypercube.
The additional generator $w_n$ joins every vertex $x$ to its antipodal vertex $x+w_n$. For this reason, $Q_n^d$ is also called the **folded cube graph**.

## Heuberger matrix representation

The folded cube has the standardized matrix representation
\[Q_n^d \cong \left(w_{n+1}^t\;\middle|\;2I_{n+1}\right)^{\mathrm{SACG}}\]

Indeed, the columns of $2I_{n+1}$ impose the relations
\[2e_1=\cdots=2e_{n+1}=0,\]
while the column $w_{n+1}^t$ imposes
\[e_1+\cdots+e_{n+1}=0.\]

The resulting quotient group is isomorphic to $\mathbb{Z}_2^n$.
Under this isomorphism, the images of $e_1,\dots,e_n$ are the standard basis vectors, while the image of $e_{n+1}$ is
\[e_1+\cdots+e_n=w_n.\]

Thus the standardized generators correspond exactly to
\[e_1,\dots,e_n,w_n.\]

## Related terminology

A **projective cube** is obtained by identifying each pair of antipodal vertices of an ordinary hypercube.
This differs from the folded cube, where antipodal vertices remain distinct and are joined by edges.