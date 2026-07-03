---
type: concept
title: Asymptotics & Integral Bounds
lang: en
pair: "[[asymptotics-and-integral-bounds.ko]]"
course: "6.042J"
lectures: [13]
summary: Big-O/Theta/Omega compare growth rates; sums are bounded by integrals, and Stirling approximates n!.
tags: [asymptotics]
prereqs: [[[sums-and-techniques]]]
related: [[[divide-and-conquer-recurrences]]]
source: [[[L13-sums-and-asymptotics]]]
status: draft
---
# Asymptotics & Integral Bounds

*(한국어: [점근 분석과 적분 한계 (Asymptotics, Integral Bounds)](/portfolio/study/asymptotics-and-integral-bounds.ko/))*

> Big-O/Theta/Omega compare growth rates; sums are bounded by integrals, and Stirling approximates n!.

## Idea
$f=O(g)$ means $f$ grows no faster than $g$ (up to a constant); $\Omega$ is a lower bound,
$\Theta$ is both. A monotone sum is sandwiched by integrals:
$\int_1^{n} f\,dx \le \sum_{k=1}^{n} f(k) \le f(1)+\int_1^{n} f\,dx$ (for increasing $f$).

## Why it matters
The standard way to get tight bounds on sums that have no closed form (e.g. $\sum\ln k$),
and the shared language for comparing algorithm costs.

## Details
**Stirling's approximation:** $n!\sim \sqrt{2\pi n}\,(n/e)^n$, so $\ln n!=\Theta(n\ln n)$ —
which is the comparison-sorting lower bound. Integral bounds give $H_n=\ln n+\Theta(1)$.

## Related
[Sums & Summation Techniques](/portfolio/study/sums-and-techniques/) · [Divide-and-Conquer Recurrences & Master Theorem](/portfolio/study/divide-and-conquer-recurrences/)
