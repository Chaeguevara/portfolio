---
type: concept
title: Change of Basis
lang: en
pair: "[[change-of-basis.ko]]"
course: "18.06"
lectures: [31]
summary: The same vector/map has different coordinates in different bases; related by B = M^{-1}AM.
tags: [transformations]
prereqs: [[[linear-transformation]], [[diagonalization]]]
related: [[[linear-transformation]], [[diagonalization]], [[singular-value-decomposition]]]
source: [[[L31-change-of-basis-image-compression]]]
status: draft
---
# Change of Basis

*(한국어: [기저 변환 (Change of Basis)](/portfolio/study/change-of-basis.ko/))*

> The same vector/map has different coordinates in different bases; related by B = M^{-1}AM.

## Idea
A vector's **coordinates** change when you change the basis; if $M$ has the new basis vectors
as columns, old and new coordinates relate by $M$. A linear map's matrix changes by
**similarity**:
$$
B = M^{-1} A M.
$$

## Why it matters
Choosing the right basis simplifies a map. [Diagonalization & Powers of A](/portfolio/study/diagonalization/) is exactly "change to the
eigenvector basis," where $A$ becomes diagonal $\Lambda$. The
[Singular Value Decomposition (SVD)](/portfolio/study/singular-value-decomposition/) uses two bases ($U$ and $V$) to make any $A$ diagonal.

## Details
- Properties invariant under change of basis: eigenvalues, trace, determinant, rank.
- Application: **image compression** keeps only the large coefficients in a good basis
  (e.g. SVD / wavelet / Fourier basis).

## Related
[Linear Transformations](/portfolio/study/linear-transformation/) · [Diagonalization & Powers of A](/portfolio/study/diagonalization/) · [Singular Value Decomposition (SVD)](/portfolio/study/singular-value-decomposition/)
