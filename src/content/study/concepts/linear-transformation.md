---
type: concept
title: Linear Transformations
lang: en
pair: "[[linear-transformation.ko]]"
course: "18.06"
lectures: [30]
summary: Maps T with T(cu+dv)=cT(u)+dT(v); once bases are chosen, every such map IS a matrix.
tags: [transformations]
prereqs: [[[matrix-multiplication]], [[independence-basis-dimension]]]
related: [[[change-of-basis]], [[matrix-multiplication]], [[four-fundamental-subspaces]]]
source: [[[L30-linear-transformations-and-their-matrices]]]
status: draft
---
# Linear Transformations

*(한국어: [선형변환 (Linear Transformations)](/portfolio/study/linear-transformation.ko/))*

> Maps T with T(cu+dv)=cT(u)+dT(v); once bases are chosen, every such map IS a matrix.

## Idea
A **linear transformation** $T:V\to W$ preserves combinations:
$T(cu+dv)=cT(u)+dT(v)$. Fix a basis for $V$ and $W$, and $T$ is represented by a **matrix**
$A$ (its columns are the images of the basis vectors). Conversely every matrix is a linear
map.

## Why it matters
This is the abstract heart of the subject: matrices are not just number grids — they are
linear maps. Injectivity ($N(A)=\{0\}$), surjectivity ($C(A)=W$), and invertibility all read
off the [The Four Fundamental Subspaces](/portfolio/study/four-fundamental-subspaces/).

## Details
- Examples: rotation, projection, derivative (on polynomials), integration.
- Composition of maps = product of matrices.
- The matrix **depends on the chosen bases** — changing them gives a similar matrix
  (see [Change of Basis](/portfolio/study/change-of-basis/)).

## Related
[Change of Basis](/portfolio/study/change-of-basis/) · [Matrix Multiplication](/portfolio/study/matrix-multiplication/) · [The Four Fundamental Subspaces](/portfolio/study/four-fundamental-subspaces/)
