---
id: sacg.homomorphisms.criterion
kind: lemma
title: Homomorphism criterion for standardized abelian Cayley graphs
requires:
  - sacg.matrix-realization
  - group.quotient-homomorphism-criterion
  - cayley.generator-respecting-homomorphism
source:
  paper: matrix-method.paper
  section: matrix-method.graph-homomorphisms
---

# Main Content

Let $X$ and $Y$ be standardized abelian Cayley graphs with Heuberger matrices $M_X=(y_1\ \cdots\ y_r)\in\mathbb{Z}^{m\times r}$ and $M_Y=(z_1\ \cdots\ z_s)\in\mathbb{Z}^{\ell\times s}$, respectively.

Let $H_X=\langle y_1,\dots,y_r\rangle_{\mathbb{Z}}\leq\mathbb{Z}^m$ and $H_Y=\langle z_1,\dots,z_s\rangle_{\mathbb{Z}}\leq\mathbb{Z}^{\ell}$.

Let $e_1,\dots,e_m$ be the standard basis of $\mathbb{Z}^m$, and let $e'_1,\dots,e'_{\ell}$ be the standard basis of $\mathbb{Z}^{\ell}$.

Suppose that $\tau\colon\mathbb{Z}^m\to\mathbb{Z}^{\ell}$ is a group homomorphism.
The formula
\[\overline{\tau}(H_X+u)=H_Y+\tau(u)\]
defines a graph homomorphism from $X$ to $Y$ if and only if the following conditions hold.

1. For every column $y_j$ of $M_X$, $\tau(y_j)\in H_Y$.
2. For every $i\in\{1,\dots,m\}$, $H_Y+\tau(e_i)\in\{H_Y\pm e'_1,\dots,H_Y\pm e'_{\ell}\}$.

In particular, choose a function $f\colon\{1,\dots,m\}\to\{1,\dots,\ell\}$ and signs $\varepsilon_i\in\{-1,1\}$, and define $\tau$ by
\[\tau(e_i)=\varepsilon_i e'_{f(i)}.\]
Then $\tau$ induces a graph homomorphism from $X$ to $Y$ whenever
\[\sum_{i=1}^m y_{ij}\varepsilon_i e'_{f(i)}\in H_Y\]
for every $j\in\{1,\dots,r\}$.

When such a homomorphism exists, we write
\[(M_X)^{\mathrm{SACG}}_X \xrightarrow[\overline{\tau}]{\circledcirc} (M_Y)^{\mathrm{SACG}}_Y.\]

## Proof

Since the columns $y_1,\dots,y_r$ generate $H_X$, condition (1) is equivalent to $\tau(H_X)\subseteq H_Y$.
By [[group.quotient-homomorphism-criterion]], this is equivalent to $\overline{\tau}$ being a well-defined group homomorphism from $\mathbb{Z}^m/H_X$ to $\mathbb{Z}^{\ell}/H_Y$.

The connection sets of $X$ and $Y$ are $S_X=\{H_X\pm e_1,\dots,H_X\pm e_m\}$ and $S_Y=\{H_Y\pm e'_1,\dots,H_Y\pm e'_{\ell}\}$, respectively.
For every $i$, we have
\[\overline{\tau}(H_X+e_i)=H_Y+\tau(e_i).\]
Thus, condition (2) is equivalent to $\overline{\tau}(S_X)\subseteq S_Y$.

It follows from [[cayley.generator-respecting-homomorphism]] that conditions (1) and (2) are sufficient for $\overline{\tau}$ to be a graph homomorphism.

Conversely, suppose that $\overline{\tau}$ defines a graph homomorphism from $X$ to $Y$.

Since $\overline{\tau}$ is well-defined, [[group.quotient-homomorphism-criterion]] gives condition (1).

For each $i$, the vertices $H_X$ and $H_X+e_i$ are adjacent in $X$.
Their images $H_Y$ and $H_Y+\tau(e_i)$ must therefore be adjacent in $Y$, which gives condition (2).

The final sufficient condition follows by substituting $\tau(e_i)=\varepsilon_i e'_{f(i)}$ into
\[\tau(y_j)=\sum_{i=1}^m y_{ij}\tau(e_i).\]
