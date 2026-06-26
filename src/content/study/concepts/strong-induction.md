---
type: concept
title: Strong Induction
lang: en
pair: "[[strong-induction.ko]]"
course: "6.042J"
lectures: [3]
summary: An induction where the step may assume P holds for all values up to n, not just n itself.
tags: [proofs, induction]
prereqs: [[[induction]]]
related: [[[well-ordering-principle]], [[divide-and-conquer-recurrences]]]
source: [[[L03-strong-induction]]]
status: draft
---
# Strong Induction

*(한국어: [강한 귀납법 (Strong Induction)](/portfolio/study/strong-induction.ko/))*

> An induction where the step may assume P holds for all values up to n, not just n itself.

## Idea
To prove $P(n)$, assume $P(0),P(1),\dots,P(n-1)$ all hold and derive $P(n)$. Logically
equivalent to ordinary induction, but the stronger hypothesis is often what you need.

## Why it matters
Perfect when $n$ breaks into *smaller pieces of varying size* — e.g. every integer $>1$ has
a prime factorization (factor $n=ab$ and apply the hypothesis to $a,b<n$).

## Details
Used to show any postage $\ge 8$ cents is payable with 3- and 5-cent stamps, and to justify
divide-and-conquer recurrences where subproblems have size $n/2$ or smaller.

## Related
[Mathematical Induction](/portfolio/study/induction/) · [Well-Ordering Principle](/portfolio/study/well-ordering-principle/) · [Divide-and-Conquer Recurrences & Master Theorem](/portfolio/study/divide-and-conquer-recurrences/)
