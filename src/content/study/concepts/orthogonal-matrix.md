---
type: concept
title: Orthogonal Matrix
lang: en
pair: "[[orthogonal-matrix.ko]]"
course: "18.06"
lectures: [17]
summary: "A square matrix Q with orthonormal columns: Q^TQ=I, so Q^{-1}=Q^T; preserves lengths and angles."
tags: [orthogonality]
prereqs: [[[orthogonality]]]
related: [[[qr-factorization]], [[symmetric-matrix]], [[singular-value-decomposition]]]
source: [[[L17-orthogonal-matrices-and-gram-schmidt]]]
status: draft
---
Orthogonal Matrix

*(한국어: [직교 행렬 (Orthogonal Matrix)](/portfolio/study/orthogonal-matrix.ko/))*

> A square matrix Q with orthonormal columns: Q^TQ=I, so Q^{-1}=Q^T; preserves lengths and angles.

## Idea
$Q$ is **orthogonal** if its columns are orthonormal, i.e. $Q^TQ=I$. Then $Q^{-1}=Q^T$ and
$\|Qx\|=\|x\|$ — multiplication by $Q$ is a rotation/reflection.

## Why it matters
Orthogonal matrices are the "nicest" matrices: perfectly conditioned, easy to invert, and
they appear in [QR Factorization](/portfolio/study/qr-factorization/) ($Q$), the spectral theorem for [Symmetric Matrices & the Spectral Theorem](/portfolio/study/symmetric-matrix/)
($A=Q\Lambda Q^T$), and the [Singular Value Decomposition (SVD)](/portfolio/study/singular-value-decomposition/) ($U,V$).

## Details
- $\det Q = \pm 1$; eigenvalues have $|\lambda|=1$.
- Examples: rotations, reflections, **permutation matrices**.
- Products of orthogonal matrices are orthogonal.

## Related
[QR Factorization](/portfolio/study/qr-factorization/) · [Symmetric Matrices & the Spectral Theorem](/portfolio/study/symmetric-matrix/) · [Singular Value Decomposition (SVD)](/portfolio/study/singular-value-decomposition/)
