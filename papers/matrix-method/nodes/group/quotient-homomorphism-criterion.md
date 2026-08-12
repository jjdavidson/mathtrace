---
id: group.quotient-homomorphism-criterion
kind: lemma
title: Homomorphisms of quotient groups
requires: []
source:
  paper: matrix-method.paper
  section: matrix-method.graph-homomorphisms
---

# Main Content

Let $A$ and $B$ be abelian groups, let $H\leq A$ and $J\leq B$, and let $\tau\colon A\to B$ be a group homomorphism.
The formula
\[\overline{\tau}(a+H)=\tau(a)+J\]
defines a well-defined group homomorphism from $A/H$ to $B/J$ if and only if $\tau(H)\subseteq J$.

## Proof

First, suppose that $\tau(H)\subseteq J$.

If $a+H = a' + H$, then $a-a'\in H$.
Therefore,
\[\tau(a)-\tau(a')=\tau(a-a')\in J,\]
so $\tau(a) + J = \tau(a') + J$.
Thus, $\overline{\tau}$ is well-defined, and it follows directly from the definition that $\overline{\tau}$ is a group homomorphism.

Conversely, suppose that $\overline{\tau}$ is well-defined.
For every $h\in H$, we have $h + H = H$.
Hence,
\[\tau(h) + J = \overline{\tau}(h+H) = \overline{\tau}(H) = J.\]
Therefore, $\tau(h)\in J$, and so $\tau(H)\subseteq J$.