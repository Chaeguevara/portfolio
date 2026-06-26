---
type: concept
title: Derandomization
lang: en
pair: "[[derandomization.ko]]"
course: "6.046J"
lectures: [22]
summary: Convert a randomized algorithm into a deterministic one, e.g. by the method of conditional expectations.
tags: [randomization]
prereqs: [[[randomized-algorithms]]]
related: [[[randomized-algorithms]], [[approximation-algorithms]]]
source: [[[L22-derandomization]]]
status: draft
---
# Derandomization

*(한국어: [비무작위화 (Derandomization)](/portfolio/study/derandomization.ko/))*

> Convert a randomized algorithm into a deterministic one, e.g. by the method of conditional expectations.

## Idea
If a random algorithm achieves expected value $E$, then *some* fixed choice does at least as
well. The **method of conditional expectations** fixes the random bits one at a time, each time
choosing the value that keeps the conditional expectation on the good side.

## Why it matters
Gives deterministic guarantees from randomized analyses — important when randomness is costly
or unavailable, and a standard way to obtain deterministic approximation algorithms.

## Details
Example: MAX-CUT — a random cut keeps $\ge E/2$ edges in expectation; deciding each vertex's
side greedily to maintain that expectation yields a deterministic $\tfrac12$-approximation.
**Pairwise independence** and small sample spaces are another derandomization route.

## Related
[Randomized Algorithms](/portfolio/study/randomized-algorithms/) · [Approximation Algorithms](/portfolio/study/approximation-algorithms/)
