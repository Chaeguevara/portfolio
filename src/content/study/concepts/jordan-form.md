---
type: concept
title: Similar Matrices & Jordan Form
lang: en
pair: "[[jordan-form.ko]]"
course: "18.06"
lectures: [28]
summary: Similar matrices B=M^{-1}AM share eigenvalues; the Jordan form is the canonical near-diagonal form when A can't be diagonalized.
tags: [special-matrices]
prereqs: [[[diagonalization]]]
related: [[[diagonalization]], [[eigenvalues-eigenvectors]]]
source: [[[L28-similar-matrices-and-jordan-form]]]
status: draft
---
# Similar Matrices & Jordan Form

*(한국어: [닮은 행렬과 조르당 형 (Jordan Form)](/portfolio/study/jordan-form.ko/))*

> Similar matrices B=M^{-1}AM share eigenvalues; the Jordan form is the canonical near-diagonal form when A can't be diagonalized.

## Idea
$A$ and $B$ are **similar** if $B=M^{-1}AM$ — same map in a different basis. Similar matrices
have the **same eigenvalues** (and trace, determinant, rank). When $A$ is **defective** (too
few eigenvectors), the closest you can get to diagonal is the **Jordan form**: block-diagonal
with **Jordan blocks** that have $\lambda$ on the diagonal and $1$'s just above it.

## Why it matters
It completes the eigenvalue theory: every matrix is similar to a Jordan form, so it explains
what happens with repeated eigenvalues where [Diagonalization & Powers of A](/portfolio/study/diagonalization/) fails.

## Details
- A Jordan block of size $k$ for $\lambda$ has one eigenvector but a chain of $k$ generalized
  eigenvectors.
- Geometric multiplicity (# eigenvectors) $\le$ algebraic multiplicity (# repeated roots).
- Mostly theoretical (numerically unstable) but conceptually decisive.

## Related
[Diagonalization & Powers of A](/portfolio/study/diagonalization/) · [Eigenvalues & Eigenvectors](/portfolio/study/eigenvalues-eigenvectors/)
