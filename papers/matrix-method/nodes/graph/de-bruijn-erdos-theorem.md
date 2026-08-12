---
id: graph.de-bruijn-erdos-theorem
kind: theorem
title: De Bruijn–Erdős theorem
requires:
  - graph.chromatic-number
  - cayley.graph
source:
  paper: matrix-method.paper
  section: matrix-method.introduction
---

# Main Content

Let $X$ be a possibly infinite graph, and let $k$ be a positive integer.
Then $X$ is $k$-colorable if and only if every finite subgraph of $X$ is $k$-colorable.

Equivalently, if $X$ is not $k$-colorable, then $X$ contains a finite subgraph that is not $k$-colorable.
In particular, if $\chi(X)$ is finite, then $X$ contains a finite subgraph $F$ such that $\chi(F)=\chi(X)$.

## Cayley graph consequence

Let $G$ be a group, let $S\subseteq G$ be symmetric, and suppose
$X=\operatorname{Cay}(G,S)$ has finite chromatic number.
Then
\[
\chi(X)
=
\max_{\substack{R\subseteq S\\ R\text{ finite and symmetric}}}
\chi\bigl(\operatorname{Cay}(G,R)\bigr).
\]
Indeed, every graph $\operatorname{Cay}(G,R)$ occurring on the right is a spanning subgraph of $X$, so its chromatic number is at most $\chi(X)$.

Conversely, choose a finite subgraph $F\subseteq X$ satisfying $\chi(F)=\chi(X)$.
Only finitely many elements of $S$ occur as labels of the edges of $F$.
Let $R$ consist of these elements together with their inverses.
Then $F\subseteq\operatorname{Cay}(G,R)\subseteq X$, and hence
\[
\chi(X)=\chi(F)
\leq
\chi\bigl(\operatorname{Cay}(G,R)\bigr)
\leq
\chi(X).
\]
Therefore equality holds throughout.

## Remark

The de Bruijn–Erdős theorem is a compactness result.
Its standard proof uses a form of the axiom of choice.