---
id: graph.cartesian-product-chromatic-number
kind: lemma
title: Chromatic number of a Cartesian product
requires:
  - graph.cartesian-product
  - graph.chromatic-number
source:
  paper: matrix-method.paper
  section: matrix-method.basal-chromatic-results
---

# Main Content

Let $X$ and $Y$ be nonempty graphs with finite chromatic numbers. Then
\[\chi(X\square Y) = \max\{\chi(X),\chi(Y)\}.\]

## Proof

Fix a vertex $y\in V(Y)$.
The subgraph of $X\square Y$ induced by $V(X)\times\{y\}$ is isomorphic to $X$.
Similarly, for any $x\in V(X)$, the subgraph induced by $\{x\}\times V(Y)$ is isomorphic to $Y$.

Since any proper coloring of a graph induces a proper coloring on any subgraph
\[\chi(X\square Y) \geq \max\{\chi(X),\chi(Y)\}.\]

Set $k=\max\{\chi(X),\chi(Y)\}$.
Choose proper colorings $c_X:V(X)\to\mathbb{Z}_k$ and $c_Y:V(Y)\to\mathbb{Z}_k$.
Define $c:V(X\square Y)\to\mathbb{Z}_k$ by
\[c(x,y)=c_X(x)+c_Y(y).\]
Suppose that $(x_1,y_1)$ and $(x_2,y_2)$ are adjacent in $X\square Y$.

If $x_1=x_2$ and $y_1$ is adjacent to $y_2$ in $Y$, then $c_Y(y_1)\neq c_Y(y_2)$, and hence $c(x_1,y_1)\neq c(x_2,y_2)$.

If $x_1$ is adjacent to $x_2$ in $X$ and $y_1=y_2$, then $c_X(x_1)\neq c_X(x_2)$, and again $c(x_1,y_1)\neq c(x_2,y_2)$.

Thus, $c$ is a proper $k$-coloring of $X\square Y$.
Therefore, $\chi(X\square Y) \leq k$.
Combining the two inequalities gives
\[\chi(X\square Y) = \max\{\chi(X),\chi(Y)\}.\]