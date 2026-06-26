---
type: concept
title: Positive Definite Matrices
lang: en
pair: "[[positive-definite.ko]]"
course: "18.06"
lectures: [25, 27]
summary: Symmetric A with x^TAx>0 for all x≠0; equivalently all eigenvalues, pivots, and leading minors are positive.
tags: [special-matrices]
prereqs: [[[symmetric-matrix]]]
related: [[[symmetric-matrix]], [[least-squares]]]
source: [[[L25-symmetric-matrices-and-positive-definiteness]], [[L27-positive-definite-matrices-and-minima]]]
status: draft
---
# Positive Definite Matrices

*(한국어: [양의정부호 행렬 (Positive Definite Matrices)](/portfolio/study/positive-definite.ko/))*

> Symmetric A with x^TAx>0 for all x≠0; equivalently all eigenvalues, pivots, and leading minors are positive.

## Idea
A symmetric $A$ is **positive definite** if the quadratic form $x^TAx>0$ for every nonzero
$x$. Four equivalent tests:
1. all eigenvalues $\lambda_i>0$;
2. all pivots $>0$;
3. all leading principal minors $>0$;
4. $A=R^TR$ for some $R$ with independent columns.

## Why it matters
Positive definiteness means the quadratic $x^TAx$ is a **bowl with a unique minimum** — the
foundation of optimization, stability, and why $A^TA$ is invertible in [Least Squares](/portfolio/study/least-squares/).

## Details
- Positive **semidefinite** relaxes to $\ge 0$ (eigenvalues $\ge 0$); $A^TA$ is always at
  least semidefinite.
- The geometry is an **ellipsoid** $x^TAx=1$ with axes along the eigenvectors.

## Related
[Symmetric Matrices & the Spectral Theorem](/portfolio/study/symmetric-matrix/) · [Least Squares](/portfolio/study/least-squares/)
