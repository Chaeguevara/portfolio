---
type: concept
title: Cofactor Expansion
lang: en
pair: "[[cofactor-expansion.ko]]"
course: "18.06"
lectures: [19]
summary: Compute det A by expanding along a row/column using signed minors (cofactors).
tags: [determinants]
prereqs: [[[determinant]]]
related: [[[determinant]], [[cramers-rule]]]
source: [[[L19-determinant-formulas-and-cofactors]]]
status: draft
---
# Cofactor Expansion

*(한국어: [여인수 전개 (Cofactor Expansion)](/portfolio/study/cofactor-expansion.ko/))*

> Compute det A by expanding along a row/column using signed minors (cofactors).

## Idea
Expand along row $i$:
$$
\det A = \sum_{j} a_{ij}\,C_{ij},\qquad C_{ij}=(-1)^{i+j}\det M_{ij},
$$
where $M_{ij}$ is $A$ with row $i$ and column $j$ deleted (a **minor**), and $C_{ij}$ is the
signed **cofactor**.

## Why it matters
It gives a recursive formula for the determinant and, via the cofactor matrix, an explicit
formula for the inverse: $A^{-1}=\frac{1}{\det A}C^T$ (the adjugate). It is the bridge from
$\det$ to [Cramer's Rule & Volume](/portfolio/study/cramers-rule/).

## Details
- Best expanded along a row/column with many zeros.
- Theoretically clean but **exponential** to compute directly — elimination (product of
  pivots) is the practical route.

## Related
[Determinant](/portfolio/study/determinant/) · [Cramer's Rule & Volume](/portfolio/study/cramers-rule/) · [Matrix Inverse](/portfolio/study/matrix-inverse/)
