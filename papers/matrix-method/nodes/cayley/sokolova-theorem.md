---
id: cayley.sokolova-theorem
kind: theorem
title: Sokolová's theorem
requires:
  - cayley.cube-like-graphs
  - graph.homomorphism-chromatic-number
source:
  paper: matrix-method.paper
  section: matrix-method.payans-theorem
---

# Main Content

If $n$ is a positive even integer, then the folded cube $Q_n^d$ has chromatic number $\chi(Q_n^d)=4$.

## Upper bound

Define $\phi\colon\mathbb{Z}_2^n\to\mathbb{Z}_2^2$ by
\[\phi(x_1,\dots,x_n) = (x_1,x_2+\cdots+x_n).\]

The standard generators satisfy $\phi(e_1)=(1,0)$ and $\phi(e_j)=(0,1)$ for every $j\in\{2,\dots,n\}$.

Because $n$ is even,
\[\phi(w_n) = (1,n-1) =(1,1)\]
in $\mathbb{Z}_2^2$.
Consequently, $\phi$ induces a graph homomorphism $Q_n^d\to\operatorname{Cay}\bigl(\mathbb{Z}_2^2,\{(1,0),(0,1),(1,1)\}\bigr)$.

The target graph is $Q_2^d\cong K_4$.
Therefore, $\chi(Q_n^d)\leq4$.

## Lower bound

We prove by induction over the positive even integers that $Q_n^d$ is not $3$-colorable.

The base case is $Q_2^d\cong K_4$, which is not $3$-colorable.

Suppose that $Q_n^d$ is not $3$-colorable, and assume for a contradiction that $c\colon\mathbb{Z}_2^{n+2}\to\mathbb{Z}_3$ is a proper $3$-coloring of $Q_{n+2}^d$.

For tuples $v$ and $u$, let $v*u$ denote their concatenation.
For each $v\in\mathbb{Z}_2^n$, consider the set
\[A_v =\left\{c\bigl(v*(0,0)\bigr),c\bigl((v+w_n)*(1,0)\bigr)\right\}.\]

There is a unique $k\in\mathbb{Z}_3$ such that $A_v=\{k\}$ or $A_v=\{k,k+1\}$, where addition is taken modulo $3$.
Define $c'(v)=k$.
Sokolová’s local case analysis, using the coordinate and antipodal edges of $Q_{n+2}^d$, shows that $c'(v)\neq c'(v+e_j)$ for every $j\in\{1,\dots,n\}$ and that $c'(v)\neq c'(v+w_n)$.

Thus $c'$ is a proper $3$-coloring of $Q_n^d$, contradicting the induction hypothesis.
It follows that $\chi(Q_n^d)\geq4$.

Combining the two bounds gives $\chi(Q_n^d)=4$.

## Antipodal reformulation

Let $Q_n$ denote the ordinary $n$-dimensional hypercube.

When $n$ is even, every proper $3$-coloring of $Q_n$ assigns the same color to some pair of antipodal vertices.

Indeed, a proper $3$-coloring that separated every antipodal pair would extend to a proper $3$-coloring of $Q_n^d$, contradicting the theorem.
