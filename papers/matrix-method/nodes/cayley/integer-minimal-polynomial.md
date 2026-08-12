---
id: cayley.integer-minimal-polynomial
kind: definition
title: Minimal polynomial over the integers
requires: []
source:
  paper: matrix-method.paper
  section: matrix-method.graph-homomorphisms-and-chromatic-numbers
---

# Main Content

Let $\omega\in\mathbb{C}$ be algebraic, and let $\operatorname{min}_{\mathbb{Q}}\omega$ denote the monic minimal polynomial of $\omega$ over $\mathbb{Q}$.
The *minimal polynomial of $\omega$ over the integers* is
\[\operatorname{min}_{\mathbb{Z}}\omega = k\operatorname{min}_{\mathbb{Q}}\omega,\]
where $k$ is the smallest positive integer for which the polynomial on the right has integer coefficients.
Thus
\[\operatorname{min}_{\mathbb{Z}}\omega = c_dx^d+\cdots+c_1x+c_0\]
is the unique primitive irreducible polynomial in $\mathbb{Z}[x]$ with positive leading coefficient having $\omega$ as a root.

## Integer-relation property

Let $p(x)=\operatorname{min}_{\mathbb{Z}}\omega$.
If $q(x)\in\mathbb{Z}[x]$, then $q(\omega) = 0$ implies $p(x)\mid q(x)$ in $\mathbb{Z}[x]$.

The forward direction follows from the minimality of $\operatorname{min}_{\mathbb{Q}}\omega$ together with Gauss's lemma.
Consequently, integer relations among $1,\omega,\omega^2,\dots,\omega^{m-1}$
are precisely the coefficient vectors of the integer multiples of $p(x)$ having degree less than $m$.