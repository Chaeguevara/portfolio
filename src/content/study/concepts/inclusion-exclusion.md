---
type: concept
title: Inclusion–Exclusion
lang: en
pair: "[[inclusion-exclusion.ko]]"
course: "6.042J"
lectures: [17]
summary: Count a union by adding sets, subtracting pairwise overlaps, adding triples, and so on.
tags: [counting]
prereqs: [[[counting-principles]]]
related: [[[pigeonhole-principle]], [[probability-basics]]]
source: [[[L17-counting-rules-ii]]]
status: draft
---
# Inclusion–Exclusion

*(한국어: [포함–배제 원리 (Inclusion–Exclusion)](/portfolio/study/inclusion-exclusion.ko/))*

> Count a union by adding sets, subtracting pairwise overlaps, adding triples, and so on.

## Idea
$|A\cup B|=|A|+|B|-|A\cap B|$, and in general
$|A_1\cup\dots\cup A_n|=\sum|A_i|-\sum|A_i\cap A_j|+\dots$ with alternating signs over all
intersections.

## Why it matters
The standard way to count things defined by "satisfies at least one of several conditions",
and to count the complement ("none of the bad properties").

## Details
**Derangements** (permutations with no fixed point): $D_n=n!\sum_{k=0}^n\tfrac{(-1)^k}{k!}\approx
n!/e$. Inclusion–exclusion also gives Euler's totient $\phi(n)$ and probability-of-union
formulas.

## Related
[Counting: Sum, Product & Bijections](/portfolio/study/counting-principles/) · [Pigeonhole Principle](/portfolio/study/pigeonhole-principle/) · [Probability: Sample Spaces & the Four-Step Method](/portfolio/study/probability-basics/)
