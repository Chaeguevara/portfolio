---
type: concept
title: Matrix Exponential & Differential Equations
lang: en
pair: "[[matrix-exponential.ko]]"
course: "18.06"
lectures: [23]
summary: Solve du/dt = Au with u(t)=e^{At}u(0); compute e^{At}=Se^{Λt}S^{-1}.
tags: [eigenvalues, applications]
prereqs: [[[diagonalization]]]
related: [[[diagonalization]], [[eigenvalues-eigenvectors]], [[markov-matrix]]]
source: [[[L23-differential-equations-and-exp-at]]]
status: draft
---
# Matrix Exponential & Differential Equations

*(한국어: [행렬 지수와 미분방정식 (Matrix Exponential)](/portfolio/study/matrix-exponential.ko/))*

> Solve du/dt = Au with u(t)=e^{At}u(0); compute e^{At}=Se^{Λt}S^{-1}.

## Idea
The system $\frac{du}{dt}=Au$ has solution $u(t)=e^{At}u(0)$, where the
**matrix exponential** is $e^{At}=\sum_k \frac{(At)^k}{k!}$. Via
[Diagonalization & Powers of A](/portfolio/study/diagonalization/),
$$
e^{At} = S\,e^{\Lambda t}\,S^{-1},\qquad e^{\Lambda t}=\operatorname{diag}(e^{\lambda_i t}).
$$

## Why it matters
It is the continuous-time analogue of $A^k$: eigenvalues now drive **growth/decay rates**.
$\operatorname{Re}(\lambda)<0$ for all $\lambda$ ⇒ the system is **stable** (decays to 0).

## Details
- Eigenvector directions evolve independently as $e^{\lambda t}$.
- Second-order ODEs become first-order systems by stacking $u$ and $u'$.
- Compare discrete [Diagonalization & Powers of A](/portfolio/study/diagonalization/) ($|\lambda|<1$ for stability) vs continuous
  ($\operatorname{Re}\lambda<0$).

## Related
[Diagonalization & Powers of A](/portfolio/study/diagonalization/) · [Eigenvalues & Eigenvectors](/portfolio/study/eigenvalues-eigenvectors/) · [Markov Matrices](/portfolio/study/markov-matrix/)
