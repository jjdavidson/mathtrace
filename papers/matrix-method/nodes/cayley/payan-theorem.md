---
id: cayley.payan-theorem
kind: theorem
title: Payan's theorem
requires:
  - cayley.sokolova-theorem
  - cayley.folded-cube-source-homomorphism
  - graph.homomorphism-chromatic-number
source:
  paper: matrix-method.paper
  section: matrix-method.payans-theorem
---

# Main Content

A cube-like graph cannot have chromatic number $3$. Equivalently, every loopless cube-like graph is either bipartite or has chromatic number at least $4$.

## Proof

Suppose for a contradiction that $X$ is a cube-like graph satisfying $\chi(X)=3$. Then $X$ is loopless and nonbipartite.
By [[cayley.folded-cube-source-homomorphism]], there is an odd integer $\ell\geq3$ and a graph homomorphism $Q_{\ell-1}^d\longrightarrow X$.
Since $\ell$ is odd, the integer $\ell-1$ is positive and even.
Therefore, [[cayley.sokolova-theorem]] gives $\chi(Q_{\ell-1}^d)=4$.

On the other hand, the graph homomorphism and [[graph.homomorphism-chromatic-number]] give
\[\chi(Q_{\ell-1}^d) \leq \chi(X) = 3.\]

This is a contradiction. Hence no cube-like graph has chromatic number $3$.
