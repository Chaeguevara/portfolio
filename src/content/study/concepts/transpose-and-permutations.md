---
type: concept
title: Transpose & Permutation Matrices
lang: en
pair: "[[transpose-and-permutations.ko]]"
course: "18.06"
lectures: [5]
summary: A^T swaps rows and columns; permutation matrices P reorder rows and handle pivoting (PA=LU).
tags: [foundations]
prereqs: [[[matrix-multiplication]]]
related: [[[lu-factorization]], [[symmetric-matrix]], [[orthogonal-matrix]]]
source: [[[L05-transposes-permutations-spaces-r-n]]]
status: draft
---
# Transpose & Permutation Matrices

*(한국어: [전치와 순열 행렬 (Transpose & Permutations)](/portfolio/study/transpose-and-permutations.ko/))*

> A^T swaps rows and columns; permutation matrices P reorder rows and handle pivoting (PA=LU).

## Idea
The **transpose** $A^T$ has $(A^T)_{ij}=A_{ji}$. A **permutation matrix** $P$ is the
identity with rows reordered; $PA$ permutes the rows of $A$.

## Why it matters
- $A^T$ defines **symmetric** matrices ($A=A^T$, see [Symmetric Matrices & the Spectral Theorem](/portfolio/study/symmetric-matrix/)) and appears in
  $A^TA$ for [Least Squares](/portfolio/study/least-squares/) and the [The Four Fundamental Subspaces](/portfolio/study/four-fundamental-subspaces/).
- Permutations make [Gaussian Elimination](/portfolio/study/gaussian-elimination/) robust: when a pivot is zero, swap rows, giving
  $PA = LU$.

## Details
- $(AB)^T = B^T A^T$, $(A^T)^{-1} = (A^{-1})^T$.
- $A^TA$ is always symmetric and positive semidefinite.
- Permutation matrices are **orthogonal**: $P^{-1}=P^T$ (an [Orthogonal Matrix](/portfolio/study/orthogonal-matrix/)); they
  form a group of size $n!$.

## Related
[Symmetric Matrices & the Spectral Theorem](/portfolio/study/symmetric-matrix/) · [LU Factorization](/portfolio/study/lu-factorization/) · [Orthogonal Matrix](/portfolio/study/orthogonal-matrix/)
