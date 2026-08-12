---
id: cayley.unit-distance-plane
kind: definition
title: Unit-distance graph of the plane
requires:
  - cayley.graph
source:
  paper: matrix-method.paper
  section: matrix-method.introduction
---

# Main Content

Let
\[
D=\{x\in\mathbb{R}^2:\|x\|_2=1\}
\]
be the unit circle, regarded as a symmetric subset of the additive group $\mathbb{R}^2$.
The *unit-distance graph of the plane* is the [[cayley.graph|Cayley graph]]
\[
U_2=\operatorname{Cay}(\mathbb{R}^2,D).
\]

Two points $x,y\in\mathbb{R}^2$ are adjacent in $U_2$ if and only if
\[
\|x-y\|_2=1.
\]

A subgraph of $U_2$ is called a *unit-distance graph*.
The Hadwiger–Nelson problem asks for the chromatic number $\chi(U_2)$.

## Use in this paper

The root-39 construction selects an additive subgroup of the complex plane and finitely many unit generators, producing an infinite unit-distance subgraph of $U_2$ whose chromatic number can be calculated using a Heuberger matrix.
