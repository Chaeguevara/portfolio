---
type: concept
title: Variance & Deviation Bounds
lang: en
pair: "[[variance-and-deviation.ko]]"
course: "6.042J"
lectures: [24]
summary: Variance measures spread; Markov and Chebyshev bound the chance a variable strays far from its mean.
tags: [probability]
prereqs: [[[expectation]]]
related: [[[expectation]], [[random-walks]], [[independence]]]
source: [[[L24-large-deviations]]]
status: draft
---
# Variance & Deviation Bounds

*(한국어: [분산과 편차 한계 (Variance, Deviation Bounds)](/portfolio/study/variance-and-deviation.ko/))*

> Variance measures spread; Markov and Chebyshev bound the chance a variable strays far from its mean.

## Idea
$\mathrm{Var}[X]=E[(X-E[X])^2]=E[X^2]-E[X]^2$; the standard deviation is its square root.
**Markov:** for $X\ge 0$, $\Pr[X\ge a]\le E[X]/a$. **Chebyshev:**
$\Pr[\,|X-E[X]|\ge a\,]\le \mathrm{Var}[X]/a^2$.

## Why it matters
Expectation alone doesn't say how reliable an outcome is; deviation bounds turn "the average
is small" into "it's almost always small" — the basis of concentration and the weak law of
large numbers.

## Details
For independent variables, **variances add**. Summing $n$ i.i.d. terms makes the relative
spread shrink like $1/\sqrt n$, so the average concentrates. Sharper exponential bounds
(Chernoff) follow when more is known.

## Related
[Expectation & Linearity](/portfolio/study/expectation/) · [Random Walks & Gambler's Ruin](/portfolio/study/random-walks/) · [Independence](/portfolio/study/independence/)
