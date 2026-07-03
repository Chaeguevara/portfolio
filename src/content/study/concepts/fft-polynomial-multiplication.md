---
type: concept
title: FFT & Polynomial Multiplication
lang: en
pair: "[[fft-polynomial-multiplication.ko]]"
course: "6.046J"
lectures: [5]
summary: Multiply degree-n polynomials in O(n log n) by evaluating at roots of unity and interpolating back.
tags: [divide-and-conquer]
prereqs: []
related: [[[complex-matrices-fft]], [[divide-and-conquer-recurrences]]]
source: [[[L05-fast-fourier-transform]]]
status: draft
---
# FFT & Polynomial Multiplication

*(한국어: [FFT 와 다항식 곱셈 (FFT, Polynomial Multiplication)](/portfolio/study/fft-polynomial-multiplication.ko/))*

> Multiply degree-n polynomials in O(n log n) by evaluating at roots of unity and interpolating back.

## Idea
Polynomials multiply slowly ($O(n^2)$) in coefficient form but **pointwise** in value form.
The **FFT** converts coefficients $\to$ values at the $n$ complex **roots of unity** in
$O(n\log n)$ via divide-and-conquer; multiply values pointwise; the inverse FFT converts back.

## Why it matters
The fast way to multiply polynomials, big integers, and to compute **convolutions** — central
to signal processing, and a beautiful use of structure (roots of unity) for speed.

## Details
Recurrence $T(n)=2T(n/2)+O(n)=O(n\log n)$, splitting a polynomial into even/odd-indexed
terms. The roots of unity make the two halves share evaluations. Inverse FFT is the same
algorithm with conjugate roots and a $1/n$ scale.

## Related
[Complex Matrices & the FFT](/portfolio/study/complex-matrices-fft/) · [Divide-and-Conquer Recurrences & Master Theorem](/portfolio/study/divide-and-conquer-recurrences/)
