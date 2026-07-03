---
type: concept
title: Markov Matrices
lang: en
pair: "[[markov-matrix.ko]]"
course: "18.06"
lectures: [24]
summary: Non-negative columns summing to 1; λ=1 is always an eigenvalue and its eigenvector is the steady state.
tags: [eigenvalues, applications]
prereqs: [[[eigenvalues-eigenvectors]]]
related: [[[diagonalization]], [[eigenvalues-eigenvectors]]]
source: [[[L24-markov-matrices-fourier-series]]]
status: draft
---
# Markov Matrices

*(한국어: [마르코프 행렬 (Markov Matrices)](/portfolio/study/markov-matrix.ko/))*

> Non-negative columns summing to 1; λ=1 is always an eigenvalue and its eigenvector is the steady state.

## Idea
A **Markov matrix** has entries $\ge 0$ and each **column summing to 1** (probabilities).
Then $\lambda=1$ is always an eigenvalue, and all eigenvalues satisfy $|\lambda|\le 1$.

## Why it matters
It models probability flow / random transitions. Repeatedly applying it,
$u_k=A^ku_0$, converges to the **steady state** — the eigenvector for $\lambda=1$
(when the other $|\lambda|<1$). This is the math behind PageRank and equilibrium
distributions.

## Details
- $\lambda=1$ exists because the columns sum to 1 ⇒ $(1,1,\dots,1)$ is a left eigenvector.
- The steady state is found by solving $(A-I)x=0$ and normalizing.

## Related
[Eigenvalues & Eigenvectors](/portfolio/study/eigenvalues-eigenvectors/) · [Diagonalization & Powers of A](/portfolio/study/diagonalization/)
