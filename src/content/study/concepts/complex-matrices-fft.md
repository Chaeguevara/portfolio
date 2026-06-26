---
type: concept
title: Complex Matrices & the FFT
lang: en
pair: "[[complex-matrices-fft.ko]]"
course: "18.06"
lectures: [26]
summary: Hermitian/unitary generalize symmetric/orthogonal to ℂ; the Fourier matrix factors to give the O(n log n) FFT.
tags: [special-matrices, applications]
prereqs: [[[orthogonal-matrix]]]
related: [[[orthogonal-matrix]], [[symmetric-matrix]]]
source: [[[L26-complex-matrices-fast-fourier-transform]]]
status: draft
---
# Complex Matrices & the FFT

*(한국어: [복소 행렬과 FFT (Complex Matrices & FFT)](/portfolio/study/complex-matrices-fft.ko/))*

> Hermitian/unitary generalize symmetric/orthogonal to ℂ; the Fourier matrix factors to give the O(n log n) FFT.

## Idea
Over $\mathbb{C}$ the transpose becomes the **conjugate transpose** $A^*$. **Hermitian**
($A=A^*$) plays the role of symmetric (real eigenvalues); **unitary** ($U^*U=I$) plays the
role of orthogonal. The **Fourier matrix** $F_n$ (entries $\omega^{jk}$, $\omega=e^{2\pi i/n}$)
is unitary up to scale.

## Why it matters
The **FFT** factors $F_n$ into sparse pieces using $F_{n}$ in terms of $F_{n/2}$, cutting
the discrete Fourier transform from $O(n^2)$ to $O(n\log n)$ — one of the most important
algorithms in computing (signal processing, fast convolution).

## Details
- $\langle x,y\rangle = \bar x^Ty$; lengths use $|z|^2$.
- Eigenvalues of Hermitian matrices are real; of unitary, on the unit circle.

## Related
[Orthogonal Matrix](/portfolio/study/orthogonal-matrix/) · [Symmetric Matrices & the Spectral Theorem](/portfolio/study/symmetric-matrix/)
