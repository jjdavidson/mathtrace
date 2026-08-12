---
id: sacg.colorings.column-sum-gcd-bound
kind: lemma
title: Column-sum gcd bound
requires:
  - sacg.homomorphisms.matrix-homomorphisms
  - sacg.one-by-one-classification
  - graph.homomorphism-chromatic-number
source:
  paper: matrix-method.paper
  section: matrix-method.graph-homomorphisms-and-chromatic-numbers
---

# Main Content

Let $M_X=(y_1\ \cdots\ y_r)$ be a Heuberger matrix for a standardized abelian Cayley graph $X$, where $y_j=(y_{1j},\dots,y_{mj})^t\in\mathbb{Z}^m$.
For each $j\in\{1,\dots,r\}$, define
\[s_j=y_{1j}+\cdots+y_{mj}.\]
Suppose that at least one $s_j$ is nonzero, and let $d=\gcd(s_1,\dots,s_r)$.
If $d>1$, then $\chi(X)\leq3$.

## Proof

By repeatedly summing rows, we obtain a graph homomorphism
\[
(y_1\ \cdots\ y_r)^{\mathrm{SACG}}_X
\xrightarrow{\circledcirc}
(s_1\ \cdots\ s_r)^{\mathrm{SACG}}.
\]

By assumption, every nonzero $s_j$ is an integer multiple of $d$.
Using column-factor reduction and then deleting redundant and zero columns, as collected in [[sacg.homomorphisms.matrix-homomorphisms]], we obtain
\[
(s_1\ \cdots\ s_r)^{\mathrm{SACG}}
\xrightarrow{\circledcirc}
(d\ \cdots\ d\ 0\ \cdots\ 0)^{\mathrm{SACG}}
=
(d)^{\mathrm{SACG}}_Y.
\]
By [[sacg.one-by-one-classification]], the graph $Y$ is a single edge when $d=2$ and a cycle when $d\geq3$.

In either case, $\chi(Y)\leq3$.
Therefore, [[graph.homomorphism-chromatic-number]] gives 
\[\chi(X)\leq\chi(Y)\leq3.\]