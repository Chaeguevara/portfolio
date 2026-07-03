---
type: concept
title: Matrix Inverse
lang: en
pair: "[[matrix-inverse.ko]]"
course: "18.06"
lectures: [3]
summary: A^{-1} undoes A (AA^{-1}=I); it exists iff A is square with full rank, found by Gauss–Jordan.
tags: [foundations]
prereqs: [[[matrix-multiplication]], [[gaussian-elimination]]]
related: [[[determinant]], [[rank]], [[gaussian-elimination]]]
source: [[[L03-multiplication-and-inverse-matrices]]]
status: draft
---
# Matrix Inverse

*(한국어: [역행렬 (Matrix Inverse)](/portfolio/study/matrix-inverse.ko/))*

> A^{-1} undoes A (AA^{-1}=I); it exists iff A is square with full rank, found by Gauss–Jordan.

## Idea
The inverse $A^{-1}$ satisfies $AA^{-1}=A^{-1}A=I$. Then $Ax=b$ has the unique solution
$x=A^{-1}b$. For $2\times2$:
$$
\begin{bmatrix} a & b \\ c & d \end{bmatrix}^{-1}
= \frac{1}{ad-bc}\begin{bmatrix} d & -b \\ -c & a \end{bmatrix}
$$

## Why it matters
Invertibility is the dividing line: $A$ invertible $\iff$ full [Rank](/portfolio/study/rank/) $\iff$
$\det A\ne 0$ $\iff$ $N(A)=\{0\}$ $\iff$ columns independent. Most of the course's
"when can we solve / is it unique" questions reduce to this.

## Details
- **Gauss–Jordan:** row-reduce $[\,A \mid I\,]$ to $[\,I \mid A^{-1}\,]$.
- $(AB)^{-1} = B^{-1}A^{-1}$; $(A^T)^{-1} = (A^{-1})^T$.
- Computing $A^{-1}$ explicitly is rarely the efficient way to solve $Ax=b$ — use
  [LU Factorization](/portfolio/study/lu-factorization/) instead. Inverse is theory; elimination is computation.

## Related
[Determinant](/portfolio/study/determinant/) · [Rank](/portfolio/study/rank/) · [Gaussian Elimination](/portfolio/study/gaussian-elimination/)
