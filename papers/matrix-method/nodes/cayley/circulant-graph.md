---
id: cayley.circulant-graph
kind: definition
title: Circulant graph
requires:
  - cayley.graph
source:
  paper: matrix-method.paper
  section: matrix-method.introduction
---

# Main Content

Let $n$ be a positive integer and let $a_1,\dots,a_r\in\mathbb{Z}$.
The *circulant graph*
\[
C_n(a_1,\dots,a_r)
\]
is the [[cayley.graph|Cayley graph]]
\[
C_n(a_1,\dots,a_r)
=
\operatorname{Cay}\bigl(\mathbb{Z}_n,\{\pm a_1,\dots,\pm a_r\}\bigr),
\]
where the generators are interpreted modulo $n$.

Thus, two residue classes $x,y\in\mathbb{Z}_n$ are adjacent exactly when
\[
x-y\equiv\pm a_i\pmod n
\]
for some $i\in\{1,\dots,r\}$.

## Connectedness and loops

The graph $C_n(a_1,\dots,a_r)$ is connected if and only if
\[
\gcd(a_1,\dots,a_r,n)=1.
\]

It has loops if and only if at least one generator $a_i$ is congruent to $0$ modulo $n$.
