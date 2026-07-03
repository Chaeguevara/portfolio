---
type: concept
title: Column Space C(A)
lang: en
pair: "[[column-space.ko]]"
course: "18.06"
lectures: [6]
summary: All linear combinations of A's columns — the set of b for which Ax=b is solvable.
tags: [subspaces]
prereqs: [[[vector-space-and-subspace]]]
related: [[[nullspace]], [[complete-solution-ax-b]], [[rank]], [[four-fundamental-subspaces]]]
source: [[[L06-column-space-and-nullspace]]]
status: draft
---
# Column Space C(A)

*(한국어: [열공간 C(A) (Column Space)](/portfolio/study/column-space.ko/))*

> All linear combinations of A's columns — the set of b for which Ax=b is solvable.

## Idea
The **column space** $C(A)$ is the span of the columns of $A$, a subspace of
$\mathbb{R}^m$ (for an $m\times n$ matrix). By the column picture
([Three Pictures of Ax = b](/portfolio/study/linear-system-pictures/)), $Ax$ is exactly a combination of columns, so
$$
Ax=b \text{ is solvable} \iff b \in C(A).
$$

## Why it matters
It answers **existence**: which right-hand sides $b$ can be reached. Its dimension is the
[Rank](/portfolio/study/rank/). It is one of the [The Four Fundamental Subspaces](/portfolio/study/four-fundamental-subspaces/).

## Details
- $\dim C(A) = r$ (the rank) = number of pivot columns.
- The pivot columns of $A$ (not of $R$) form a basis of $C(A)$.
- Complement fact: $C(A)^\perp = N(A^T)$ (the left nullspace).

## Related
[Nullspace N(A)](/portfolio/study/nullspace/) · [Rank](/portfolio/study/rank/) · [The Four Fundamental Subspaces](/portfolio/study/four-fundamental-subspaces/)
