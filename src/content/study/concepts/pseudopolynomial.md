---
type: concept
title: Pseudopolynomial Time & Subset Sum
lang: en
pair: "[[pseudopolynomial.ko]]"
course: "6.006"
lectures: [18]
summary: A DP whose time depends on a numeric value (not just input length) runs in pseudopolynomial time — e.g. subset sum and knapsack.
tags: [dynamic-programming, complexity]
prereqs: [[[dynamic-programming]]]
related: [[[dynamic-programming]], [[complexity-classes]]]
source: [[[L18-dynamic-programming-part-4-rods-subset-sum-pseudopolyno]]]
status: draft
---
# Pseudopolynomial Time & Subset Sum

*(한국어: [유사다항 시간과 부분집합 합 (Pseudopolynomial, Subset Sum)](/portfolio/study/pseudopolynomial.ko/))*

> A DP whose time depends on a numeric value (not just input length) runs in pseudopolynomial time — e.g. subset sum and knapsack.

## Idea
**Subset sum:** is there a subset of given integers summing to target $T$? A DP over
(item index, achievable sum) solves it in $O(nT)$. That looks polynomial, but $T$ can be
exponential in its **number of bits** — the input size.

## Why it matters
Draws the line between "efficient" and "looks efficient." Pseudopolynomial algorithms are fast
when numbers are small, but the underlying problems (subset sum, knapsack) are NP-hard in
general.

## Details
Running time $O(nT)$ is polynomial in the *value* $T$ but exponential in $\log T$ (the bits to
write $T$). Knapsack is the optimization cousin. True polynomial time would have to be
polynomial in the input *length*.

## Related
[Dynamic Programming (SRTBOT)](/portfolio/study/dynamic-programming/) · [Complexity Classes: P, NP, EXP](/portfolio/study/complexity-classes/)
