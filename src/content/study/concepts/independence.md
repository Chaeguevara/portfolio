---
type: concept
title: Independence
lang: en
pair: "[[independence.ko]]"
course: "6.042J"
lectures: [20]
summary: Events are independent when one's occurrence does not change the other's probability; mutual is stronger than pairwise.
tags: [probability]
prereqs: [[[conditional-probability-and-bayes]]]
related: [[[random-variables]], [[variance-and-deviation]]]
source: [[[L20-independence]]]
status: draft
---
# Independence

*(한국어: [독립성 (Independence)](/portfolio/study/independence.ko/))*

> Events are independent when one's occurrence does not change the other's probability; mutual is stronger than pairwise.

## Idea
$A,B$ are **independent** iff $\Pr[A\cap B]=\Pr[A]\Pr[B]$ (equivalently $\Pr[A\mid B]=\Pr[A]$).
For many events, **mutual independence** requires the product rule for *every* subset, which
is strictly stronger than **pairwise** independence.

## Why it matters
Independence is what makes probabilities multiply and variances add — the assumption behind
binomial counts, error-correcting estimates, and most clean analyses.

## Details
The **birthday paradox**: with 23 people the probability of a shared birthday exceeds $1/2$,
because there are $\binom{23}{2}$ near-independent pairs. Counterexamples exist where events
are pairwise but not mutually independent.

## Related
[Conditional Probability & Bayes' Theorem](/portfolio/study/conditional-probability-and-bayes/) · [Random Variables & Distributions](/portfolio/study/random-variables/) · [Variance & Deviation Bounds](/portfolio/study/variance-and-deviation/)
