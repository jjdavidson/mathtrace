---
id: cayley.integer-distance-graph
kind: definition
title: Integer-distance graph
requires:
  - cayley.graph
source:
  paper: matrix-method.paper
  section: matrix-method.introduction
---

# Main Content

Let $D\subseteq\mathbb{Z}_{>0}$ be a set of positive integers.
The *integer-distance graph* with distance set $D$ is the [[cayley.graph|Cayley graph]]
\[
\operatorname{Cay}\bigl(\mathbb{Z},\{\pm d:d\in D\}\bigr).
\]
Thus, two integers $x$ and $y$ are adjacent exactly when $|x-y|\in D$.

For a finite list $D=\{a_1,\dots,a_m\}$, the paper writes this graph as
\[
\operatorname{Cay}\bigl(\mathbb{Z},\{\pm a_1,\dots,\pm a_m\}\bigr).
\]

## Connectedness

When $D$ is finite and $g=\gcd(D)$, the connected component containing $0$ has vertex set $g\mathbb{Z}$.
Consequently, the graph is connected if and only if $\gcd(D)=1$.

If $g>1$, every connected component is isomorphic, after division by $g$, to the integer-distance graph with distance set
\[
\{d/g:d\in D\}.
\]
