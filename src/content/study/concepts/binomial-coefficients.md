---
type: concept
title: Binomial Coefficients & Pascal's Triangle
lang: en
pair: "[[binomial-coefficients.ko]]"
course: "6.042J"
lectures: [16]
summary: C(n,k) counts k-subsets; the binomial theorem and Pascal's identity organize them.
tags: [counting]
prereqs: [[[counting-principles]]]
related: [[[counting-principles]], [[generating-functions]]]
source: [[[L16-counting-rules-i]]]
status: draft
---
# Binomial Coefficients & Pascal's Triangle

*(한국어: [이항계수와 파스칼 삼각형 (Binomial Coefficients)](/portfolio/study/binomial-coefficients.ko/))*

> C(n,k) counts k-subsets; the binomial theorem and Pascal's identity organize them.

## Idea
$\binom nk=\tfrac{n!}{k!(n-k)!}$ counts the ways to choose $k$ of $n$ items. **Pascal's
identity:** $\binom nk=\binom{n-1}{k-1}+\binom{n-1}{k}$ (item in or out). **Binomial
theorem:** $(x+y)^n=\sum_k\binom nk x^k y^{n-k}$.

## Why it matters
The most common count in CS — subsets, paths in a grid, coefficients in expansions — and the
launchpad for combinatorial proofs and generating functions.

## Details
Symmetry $\binom nk=\binom n{n-k}$; row sum $\sum_k\binom nk=2^n$ (all subsets). A
**combinatorial proof** establishes an identity by counting one set two ways instead of
algebra.

## Related
[Counting: Sum, Product & Bijections](/portfolio/study/counting-principles/) · [Generating Functions](/portfolio/study/generating-functions/)
