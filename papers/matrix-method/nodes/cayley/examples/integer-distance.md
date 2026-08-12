---
id: cayley.examples.integer-distance
kind: corollary
title: Two-generator integer distance graphs
requires:
  - cayley.integer-distance-graph
  - sacg.standardization-isomorphism
  - sacg.colorings.one-column-classification
source:
  paper: matrix-method.paper
  section: matrix-method.graph-homomorphisms-and-chromatic-numbers
---

# Main Content

Let $a$ and $b$ be coprime positive integers, and let $X=\operatorname{Cay}\bigl(\mathbb{Z},\{\pm a,\pm b\}\bigr)$ be the corresponding [[cayley.integer-distance-graph|integer-distance graph]].
Then
\[
\chi(X) =
\begin{cases}
    2, & \text{if $a$ and $b$ have the same parity},\\
    3, & \text{if $a$ and $b$ have different parities}.
\end{cases}
\]

## Proof

Define a group homomorphism $\phi\colon\mathbb{Z}^2\to\mathbb{Z}$ by
$\phi(e_1)=a$ and $\phi(e_2)=b$.
Because $\gcd(a,b)=1$, the map $\phi$ is surjective and
\[
\ker\phi = \left\langle
\begin{pmatrix}
    -b\\
    a
\end{pmatrix}
\right\rangle.
\]
Therefore, [[sacg.standardization-isomorphism]] gives
\[
X \cong
\begin{pmatrix}
    -b\\
    a
\end{pmatrix}^{\mathrm{SACG}}.
\]

Since $a$ and $b$ are coprime, they have the same parity exactly when both are odd.
In that case, the column vector $(-b,a)^t$ has two odd entries.
If $a$ and $b$ have different parities, the column vector has exactly one odd entry.
The result now follows from [[sacg.colorings.one-column-classification]].
