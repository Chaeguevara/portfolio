---
type: concept
title: Nullspace N(A)
lang: en
pair: "[[nullspace.ko]]"
course: "18.06"
lectures: [6, 7]
summary: All solutions to Ax=0 — a subspace of R^n whose dimension is n − rank.
tags: [subspaces]
prereqs: [[[vector-space-and-subspace]]]
related: [[[solving-ax-0]], [[column-space]], [[rank]], [[four-fundamental-subspaces]]]
source: [[[L06-column-space-and-nullspace]], [[L07-solving-ax-0-pivot-variables-special-solutions]]]
status: draft
---
# Nullspace N(A)

*(한국어: [영공간 N(A) (Nullspace)](/portfolio/study/nullspace.ko/))*

> All solutions to Ax=0 — a subspace of R^n whose dimension is n − rank.

## Idea
The **nullspace** $N(A)=\{x : Ax=0\}$ is a subspace of $\mathbb{R}^n$. It captures the
**non-uniqueness** of solutions: if $Ax_p=b$ then every solution is $x_p+x_n$ with
$x_n\in N(A)$ (see [Complete Solution of Ax = b](/portfolio/study/complete-solution-ax-b/)).

## Why it matters
- $N(A)=\{0\}$ $\iff$ columns of $A$ are independent $\iff$ solutions are unique.
- $\dim N(A) = n - r$ (the **nullity**), the count of free variables.

## Details
- Found by solving $Ax=0$: reduce to RREF, set each free variable to 1 in turn to get the
  **special solutions** that span $N(A)$ (see [Solving Ax = 0: Pivots, Free Variables, RREF](/portfolio/study/solving-ax-0/)).
- $N(A) = (C(A^T))^\perp$: the nullspace is orthogonal to the row space.

## Related
[Solving Ax = 0: Pivots, Free Variables, RREF](/portfolio/study/solving-ax-0/) · [Rank](/portfolio/study/rank/) · [The Four Fundamental Subspaces](/portfolio/study/four-fundamental-subspaces/)
