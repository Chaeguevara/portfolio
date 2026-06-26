---
type: concept
title: Amortized Analysis
lang: en
pair: "[[amortized-analysis.ko]]"
course: "6.046J"
lectures: [10, 11]
summary: Bound the average cost per operation over a worst-case sequence using aggregate, accounting, or potential methods.
tags: [analysis]
prereqs: []
related: [[[dynamic-array]], [[union-find]], [[competitive-analysis]]]
source: [[[L10-hashing-and-amortization]], [[L11-amortized-analysis]]]
status: draft
---
# Amortized Analysis

*(한국어: [분할상환 분석 (Amortized Analysis)](/portfolio/study/amortized-analysis.ko/))*

> Bound the average cost per operation over a worst-case sequence using aggregate, accounting, or potential methods.

## Idea
Some operations are occasionally expensive but cheap on average over any sequence. **Amortized
analysis** charges each operation a smooth cost so the total over $n$ operations is correct,
even though individual ones vary.

## Why it matters
Explains why dynamic-array append, union-find, and splay trees are efficient *in aggregate*
even though a single operation can be slow — the honest way to state their cost.

## Details
Three methods: **aggregate** (total cost / $n$); **accounting** (overcharge cheap ops, bank
credit to pay for expensive ones); **potential** (define $\Phi$ on the state so amortized cost
$=$ actual $+\Delta\Phi$). All give the same bound; pick the easiest.

## Related
[Dynamic Arrays](/portfolio/study/dynamic-array/) · [Union-Find (Disjoint Sets)](/portfolio/study/union-find/) · [Competitive Analysis (Online Algorithms)](/portfolio/study/competitive-analysis/)
