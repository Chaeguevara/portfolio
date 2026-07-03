---
type: concept
title: Random Variables & Distributions
lang: en
pair: "[[random-variables.ko]]"
course: "6.042J"
lectures: [21]
summary: A random variable maps outcomes to numbers; its distribution (PMF) lists the probability of each value.
tags: [probability]
prereqs: [[[probability-basics]]]
related: [[[expectation]], [[variance-and-deviation]], [[independence]]]
source: [[[L21-random-variables]]]
status: draft
---
# Random Variables & Distributions

*(한국어: [확률변수와 분포 (Random Variables, Distributions)](/portfolio/study/random-variables.ko/))*

> A random variable maps outcomes to numbers; its distribution (PMF) lists the probability of each value.

## Idea
A **random variable** $X:\Omega\to\mathbb{R}$ assigns a number to each outcome. Its
**probability mass function** is $p_X(k)=\Pr[X=k]$; the **CDF** is $\Pr[X\le k]$. RVs are
**independent** when their joint PMF factors.

## Why it matters
Lets us reason quantitatively about random processes — counts, times, costs — and is the
object expectation and variance summarize.

## Details
Standard families: **Bernoulli** (one trial), **binomial** $\binom nk p^k(1-p)^{n-k}$ (sum of
$n$ Bernoullis), **uniform**, **geometric** (trials until first success). The binomial is the
canonical count of successes in independent trials.

## Related
[Expectation & Linearity](/portfolio/study/expectation/) · [Variance & Deviation Bounds](/portfolio/study/variance-and-deviation/) · [Independence](/portfolio/study/independence/)
