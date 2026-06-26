---
type: concept
title: Sums & Summation Techniques
lang: en
pair: "[[sums-and-techniques.ko]]"
course: "6.042J"
lectures: [12]
summary: Evaluate and bound finite sums via arithmetic/geometric formulas, perturbation, and telescoping.
tags: [sums]
prereqs: []
related: [[[asymptotics-and-integral-bounds]], [[generating-functions]]]
source: [[[L12-sums]]]
status: draft
---
# Sums & Summation Techniques

*(한국어: [합과 합산 기법 (Sums & Summation Techniques)](/portfolio/study/sums-and-techniques.ko/))*

> Evaluate and bound finite sums via arithmetic/geometric formulas, perturbation, and telescoping.

## Idea
Core closed forms: arithmetic $\sum_{k=1}^n k=\tfrac{n(n+1)}{2}$; geometric
$\sum_{k=0}^{n} x^k=\tfrac{x^{n+1}-1}{x-1}$. The **perturbation method** writes a sum two
ways to solve for it; **telescoping** cancels consecutive terms.

## Why it matters
Running-time analysis constantly produces sums (loop costs, recursion-tree levels). Knowing
the closed form or a tight bound turns a sum into a clean $\Theta(\cdot)$.

## Details
The geometric series dominates: if $x>1$ the sum is $\Theta(x^n)$ (last term wins); if $x<1$
it converges to $\tfrac{1}{1-x}$ (first term wins). Harmonic numbers $H_n=\sum 1/k\approx\ln n$.

## Related
[Asymptotics & Integral Bounds](/portfolio/study/asymptotics-and-integral-bounds/) · [Generating Functions](/portfolio/study/generating-functions/)
