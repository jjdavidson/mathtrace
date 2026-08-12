---
id: cayley.generator-respecting-homomorphism
kind: lemma
title: Generator-respecting homomorphisms of Cayley graphs
requires:
  - cayley.graph
  - graph.homomorphism
source:
  paper: matrix-method.paper
  section: matrix-method.graph-homomorphisms
---

# Main Content

Let $G_1$ and $G_2$ be groups, and let $S_1\subseteq G_1$ and $S_2\subseteq G_2$ be symmetric subsets.
Suppose that $\psi\colon G_1\to G_2$ is a group homomorphism satisfying
\[\psi(S_1)\subseteq S_2.\]
Then $\psi$ is a graph homomorphism from $\operatorname{Cay}(G_1,S_1)$ to $\operatorname{Cay}(G_2,S_2)$.

## Proof

Suppose that $x$ and $y$ are adjacent in $\operatorname{Cay}(G_1,S_1)$.
Then $x=ys$ for some $s\in S_1$.
Since $\psi$ is a group homomorphism,
\[\psi(x)=\psi(y)\psi(s).\]
Moreover, $\psi(s)\in S_2$.
Therefore, $\psi(x)$ and $\psi(y)$ are adjacent in $\operatorname{Cay}(G_2,S_2)$.