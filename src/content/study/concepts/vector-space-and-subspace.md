---
type: concept
title: Vector Space & Subspace
lang: en
pair: "[[vector-space-and-subspace.ko]]"
course: "18.06"
lectures: [5, 6]
summary: A set closed under addition and scalar multiplication; a subspace is such a set living inside another (must contain 0).
tags: [subspaces]
prereqs: []
related: [[[column-space]], [[nullspace]], [[independence-basis-dimension]]]
source: [[[L05-transposes-permutations-spaces-r-n]], [[L06-column-space-and-nullspace]]]
status: draft
---
# Vector Space & Subspace

*(한국어: [벡터공간과 부분공간 (Vector Space & Subspace)](/portfolio/study/vector-space-and-subspace.ko/))*

> A set closed under addition and scalar multiplication; a subspace is such a set living inside another (must contain 0).

## Idea
A **vector space** is a set where you can add vectors and scale them and stay inside,
obeying the usual axioms. A **subspace** of $\mathbb{R}^n$ is a non-empty subset closed
under both operations — equivalently, closed under all linear combinations. Every subspace
**contains the zero vector**.

## Why it matters
Subspaces are the objects the whole course studies: lines/planes through the origin, the
[Column Space C(A)](/portfolio/study/column-space/), the [Nullspace N(A)](/portfolio/study/nullspace/). "Through the origin" is the catch — a plane not through
$0$ is not a subspace.

## Details
- Examples in $\mathbb{R}^3$: $\{0\}$, any line through $0$, any plane through $0$, all of
  $\mathbb{R}^3$.
- A subspace is pinned down by a **basis** and its **dimension**
  (see [Independence, Basis, Dimension](/portfolio/study/independence-basis-dimension/)).

## Related
[Column Space C(A)](/portfolio/study/column-space/) · [Nullspace N(A)](/portfolio/study/nullspace/) · [Independence, Basis, Dimension](/portfolio/study/independence-basis-dimension/)
