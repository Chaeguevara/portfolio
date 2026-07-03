---
type: concept
title: Expectation & Linearity
lang: en
pair: "[[expectation.ko]]"
course: "6.042J"
lectures: [22, 23]
summary: The expected value is the probability-weighted average; expectation is linear even for dependent variables.
tags: [probability]
prereqs: [[[random-variables]]]
related: [[[variance-and-deviation]], [[random-variables]]]
source: [[[L22-expectation-i]], [[L23-expectation-ii]]]
status: draft
---
# Expectation & Linearity

*(한국어: [기댓값과 선형성 (Expectation, Linearity)](/portfolio/study/expectation.ko/))*

> The expected value is the probability-weighted average; expectation is linear even for dependent variables.

## Idea
$E[X]=\sum_k k\,\Pr[X=k]$ (or $\sum_\omega X(\omega)\Pr[\omega]$). The key tool is
**linearity:** $E[X+Y]=E[X]+E[Y]$ — *always*, even when $X,Y$ are dependent. If they're
independent, also $E[XY]=E[X]E[Y]$.

## Why it matters
Linearity lets you decompose a complicated count into indicator variables and sum their easy
expectations — the single most useful trick in probabilistic analysis.

## Details
**Indicator method:** to find $E[\#\text{events}]$, write it as $\sum_i \mathbf 1_i$ so
$E=\sum_i\Pr[\text{event }i]$. Gives expected fixed points ($=1$), coupon-collector time
$\Theta(n\log n)$, and expected runtime of randomized quicksort.

## Related
[Variance & Deviation Bounds](/portfolio/study/variance-and-deviation/) · [Random Variables & Distributions](/portfolio/study/random-variables/)
