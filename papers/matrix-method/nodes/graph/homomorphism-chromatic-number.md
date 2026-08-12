---
id: graph.homomorphism-chromatic-number
kind: lemma
title: Homomorphisms and chromatic number
requires:
  - graph.homomorphism
  - graph.chromatic-number
source:
  paper: matrix-method.paper
  section: matrix-method.graph-homomorphisms
---

# Main Content

Let $\psi\colon X\to Y$ be a graph homomorphism.
Every proper coloring of $Y$ pulls back through $\psi$ to a proper coloring of $X$.
Consequently, if $Y$ has finite chromatic number, then
\[\chi(X)\leq\chi(Y).\]

## Proof

Let $c\colon V(Y)\to C$ be a proper coloring of $Y$.
Define a coloring of $X$ by $c\circ\psi$.
If $u$ and $v$ are adjacent in $X$, then $\psi(u)$ and $\psi(v)$ are adjacent in $Y$.
Since $c$ is proper, we have $c(\psi(u))\neq c(\psi(v))$.
Thus, $c\circ\psi$ is a proper coloring of $X$.

Taking a proper coloring of $Y$ with $\chi(Y)$ colors gives $\chi(X)\leq\chi(Y)$.