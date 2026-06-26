---
type: concept
title: "Counting: Sum, Product & Bijections"
lang: en
pair: "[[counting-principles.ko]]"
course: "6.042J"
lectures: [16]
summary: Count by sum/product rules, permutations and combinations, or by a bijection to a set you can already count.
tags: [counting]
prereqs: []
related: [[[binomial-coefficients]], [[inclusion-exclusion]], [[pigeonhole-principle]]]
source: [[[L16-counting-rules-i]]]
status: draft
---
Counting: Sum, Product & Bijections

*(한국어: [셈하기: 합·곱 법칙과 전단사 (Counting Principles)](/portfolio/study/counting-principles.ko/))*

> Count by sum/product rules, permutations and combinations, or by a bijection to a set you can already count.

## Idea
- **Sum rule:** disjoint choices add.
- **Product rule:** independent stages multiply.
- **Permutations:** $n!/(n-k)!$ ordered selections; **combinations** $\binom nk$ unordered.
- **Bijection rule:** if there's a one-to-one correspondence to set $T$, then $|S|=|T|$.

## Why it matters
The foundation of combinatorics and discrete probability — sizes of sample spaces, number
of configurations, complexity counts all reduce to these moves.

## Details
The **division rule** counts when each item is overcounted $k$ times (divide by $k$). The
bijection method is the elegant one: e.g. subsets of an $n$-set $\leftrightarrow$ binary
strings of length $n$, giving $2^n$.

## Related
[Binomial Coefficients & Pascal's Triangle](/portfolio/study/binomial-coefficients/) · [Inclusion–Exclusion](/portfolio/study/inclusion-exclusion/) · [Pigeonhole Principle](/portfolio/study/pigeonhole-principle/)
