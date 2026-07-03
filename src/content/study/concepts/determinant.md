---
type: concept
title: Determinant
lang: en
pair: "[[determinant.ko]]"
course: "18.06"
lectures: [18]
summary: A single number det A that is 0 exactly when A is singular; equals signed volume and the product of pivots.
tags: [determinants]
prereqs: [[[gaussian-elimination]]]
related: [[[cofactor-expansion]], [[cramers-rule]], [[eigenvalues-eigenvectors]]]
source: [[[L18-properties-of-determinants]]]
status: draft
---
# Determinant

*(한국어: [행렬식 (Determinant)](/portfolio/study/determinant.ko/))*

> A single number det A that is 0 exactly when A is singular; equals signed volume and the product of pivots.

## Idea
The **determinant** is defined by three properties: $\det I=1$; it **changes sign** under a
row swap; and it is **linear in each row** separately. Everything else follows.

## Why it matters
- $\det A = 0 \iff A$ is singular (not invertible).
- $|\det A|$ = volume of the box spanned by the rows/columns.
- It produces the [characteristic equation](/portfolio/study/eigenvalues-eigenvectors/)
  $\det(A-\lambda I)=0$ for [Eigenvalues & Eigenvectors](/portfolio/study/eigenvalues-eigenvectors/).

## Details
- $\det A = $ product of the pivots (with sign from row swaps).
- $\det(AB)=\det A\,\det B$, $\det(A^T)=\det A$, $\det(A^{-1})=1/\det A$.
- A triangular matrix's determinant is the product of its diagonal.

## Related
[Cofactor Expansion](/portfolio/study/cofactor-expansion/) · [Cramer's Rule & Volume](/portfolio/study/cramers-rule/) · [Eigenvalues & Eigenvectors](/portfolio/study/eigenvalues-eigenvectors/)
