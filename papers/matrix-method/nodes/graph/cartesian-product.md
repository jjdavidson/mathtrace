---
id: graph.cartesian-product
kind: definition
title: Cartesian product of graphs
requires: []
source:
  paper: matrix-method.paper
  section: matrix-method.basal-chromatic-results
---

# Main Content

Let $X$ and $Y$ be graphs with vertex sets $V(X)$ and $V(Y)$, respectively.
The *Cartesian product* of $X$ and $Y$, also called the *box product*, is the graph $X\square Y$ with vertex set $V(X)\times V(Y)$.
Two vertices $(x_1,y_1)$ and $(x_2,y_2)$ are adjacent in $X\square Y$ if and only if either

1. $x_1=x_2$ and $y_1$ is adjacent to $y_2$ in $Y$; or
2. $x_1$ is adjacent to $x_2$ in $X$ and $y_1=y_2$.