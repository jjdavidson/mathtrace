---
id: cayley.graph
kind: definition
title: Cayley graph
requires: []
source:
  paper: matrix-method.paper
  section: matrix-method.introduction
---

# Main Content
A subset $S$ of a group $G$ is *symmetric* if $s^{-1}\in S$ whenever $s\in S$.

Given a group $G$ and a symmetric subset $S\subseteq G$, the *Cayley graph* of $G$ with respect to $S$, denoted $\operatorname{Cay}(G,S)$, has vertex set $G$, with vertices $x$ and $y$ adjacent if and only if $x=ys$ for some $s\in S$.

The symmetry of $S$ ensures that adjacency is undirected.

The set $S$ is not required to generate $G$.

If the identity element of $G$ belongs to $S$, then every vertex has a loop.

A Cayley graph whose underlying group is abelian is called an *abelian Cayley graph*.

## Use in this paper

The paper generally uses $G$ for groups and $X$ for graphs.

After introducing Cayley graphs in full generality, the paper restricts attention to finite-degree connected abelian Cayley graphs.
Thus, $G$ is usually an abelian group and $S$ is a finite symmetric generating set.

When $G$ is written additively, the paper writes
\[
S=\{\pm g_1,\ldots,\pm g_m\}.
\]

The paper permits loops but does not permit multiple edges.
