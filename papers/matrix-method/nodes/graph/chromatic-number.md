---
id: graph.chromatic-number
kind: definition
title: Chromatic number
requires: []
source:
  paper: matrix-method.paper
  section: matrix-method.introduction
---

# Main Content

A *proper coloring* of a graph $X$ with color set $C$ is a function
\[
    c:V(X)\longrightarrow C
\]
such that $c(v)\neq c(w)$ whenever $v$ and $w$ are adjacent.

The *chromatic number* of $X$, denoted $\chi(X)$, is the least cardinality of a color set for which $X$ has a proper coloring.

A graph containing a loop has no proper coloring.

## Use in this paper

The paper generally uses $X$ to denote a graph and reserves $G$ for a group.

When discussing a graph with a loop, the paper says that the graph cannot be properly colored rather than assigning it a numerical chromatic number.
