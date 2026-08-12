---
id: sacg.one-row-gcd-reduction
kind: lemma
title: GCD reduction for one-row matrices
requires:
  - sacg.matrix-realization
source:
  paper: matrix-method.paper
  section: matrix-method.preliminaries
---

# Main Content

Let $M=(n_1\ \cdots\ n_r)$ be a $1\times r$ integer matrix, and let $d=\gcd(n_1,\ldots,n_r)$, where $d\geq0$ and $\gcd(0,\ldots,0)=0$.
Then
\[M^{\mathrm{SACG}}=(d)^{\mathrm{SACG}}.\]

In particular, every standardized abelian Cayley graph realized by a one-row matrix is also realized by a one-by-one matrix.

## Proof

The columns of $M$ generate the subgroup $H_M=\langle n_1,\ldots,n_r\rangle$ of $\mathbb{Z}$.

Since $d$ divides each $n_j$, we have $H_M\subseteq d\mathbb{Z}$.

If at least one $n_j$ is nonzero, Bézout’s identity gives integers $c_1,\ldots,c_r$ such that
\[c_1n_1+\cdots+c_rn_r=d.\]
Thus, $d\in H_M$, and hence $d\mathbb{Z}\subseteq H_M$.

If all the entries are zero, then both $H_M$ and $d\mathbb{Z}$ are the trivial subgroup.

Therefore, $H_M=d\mathbb{Z}$.
The matrices $M$ and $(d)$ consequently determine the same quotient of $\mathbb{Z}$ and the same standardized generating set. Hence $M^{\mathrm{SACG}}=(d)^{\mathrm{SACG}}$.

## Remark

This result applies when the entire Heuberger matrix has one row.

It does not permit an individual row of a larger matrix to be replaced independently by its gcd, because the entries in that row may be coupled to entries in the other rows through the matrix columns.

## Use in this paper

After several rows of a Heuberger matrix are merged, this lemma reduces the resulting one-row matrix to a one-by-one matrix.

In particular, if the resulting row is
\[(s_1\ \cdots\ s_r)\]
and $d=\gcd(s_1,\ldots,s_r)$, then its realization is $(d)^{\mathrm{SACG}}$.

Together with the classification of one-by-one matrix realizations, this identifies the resulting target graph and bounds its chromatic number.
