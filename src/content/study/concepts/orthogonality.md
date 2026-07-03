---
type: concept
title: Orthogonality & Orthogonal Complements
lang: en
pair: "[[orthogonality.ko]]"
course: "18.06"
lectures: [14]
summary: Vectors are orthogonal when their dot product is 0; a subspace's orthogonal complement holds everything perpendicular to it.
tags: [orthogonality]
prereqs: [[[four-fundamental-subspaces]]]
related: [[[projection]], [[four-fundamental-subspaces]], [[orthogonal-matrix]]]
source: [[[L14-orthogonal-vectors-and-subspaces]]]
status: draft
---
# Orthogonality & Orthogonal Complements

*(한국어: [직교성과 직교 보공간 (Orthogonality)](/portfolio/study/orthogonality.ko/))*

> Vectors are orthogonal when their dot product is 0; a subspace's orthogonal complement holds everything perpendicular to it.

## Idea
$x\perp y \iff x^Ty=0$. The **orthogonal complement** $S^\perp$ of a subspace $S$ is all
vectors orthogonal to every vector in $S$. Then $\dim S + \dim S^\perp = n$ and
$S\oplus S^\perp=\mathbb{R}^n$.

## Why it matters
It explains the pairing in the [The Four Fundamental Subspaces](/portfolio/study/four-fundamental-subspaces/): row space $\perp$ nullspace,
column space $\perp$ left nullspace. It is the foundation for [Projection onto a Subspace](/portfolio/study/projection/) and
[Least Squares](/portfolio/study/least-squares/) (split any $b$ into a part in $C(A)$ and a part in $N(A^T)$).

## Details
- Orthogonal vectors are automatically independent.
- Length: $\|x\|^2 = x^Tx$; Pythagoras holds for orthogonal vectors.

## Related
[Projection onto a Subspace](/portfolio/study/projection/) · [The Four Fundamental Subspaces](/portfolio/study/four-fundamental-subspaces/) · [Orthogonal Matrix](/portfolio/study/orthogonal-matrix/)
