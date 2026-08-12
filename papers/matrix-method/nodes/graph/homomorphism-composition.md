---
id: graph.homomorphism-composition
kind: lemma
title: Composition of graph homomorphisms
requires:
  - graph.homomorphism
source:
  paper: matrix-method.paper
  section: matrix-method.graph-homomorphisms
---

# Main Content

Let $\psi\colon X\to Y$ and $\varphi\colon Y\to Z$ be graph homomorphisms.
Then $\varphi\circ\psi\colon X\to Z$ is a graph homomorphism.

## Proof

Suppose that $u$ and $v$ are adjacent in $X$.

Since $\psi$ is a graph homomorphism, $\psi(u)$ and $\psi(v)$ are adjacent in $Y$.

Since $\varphi$ is a graph homomorphism, $\varphi(\psi(u))$ and $\varphi(\psi(v))$ are adjacent in $Z$.

Therefore, $\varphi\circ\psi$ is a graph homomorphism.