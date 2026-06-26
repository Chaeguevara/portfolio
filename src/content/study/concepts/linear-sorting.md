---
type: concept
title: Linear-Time Sorting (Counting & Radix)
lang: en
pair: "[[linear-sorting.ko]]"
course: "6.006"
lectures: [5]
summary: When keys are small integers, counting and radix sort order n items in O(n) by avoiding comparisons.
tags: [sorting]
prereqs: [[[comparison-sorting]]]
related: [[[comparison-sorting]], [[hash-table]]]
source: [[[L05-linear-sorting]]]
status: draft
---
# Linear-Time Sorting (Counting & Radix)

*(한국어: [선형 시간 정렬 (계수·기수 정렬)](/portfolio/study/linear-sorting.ko/))*

> When keys are small integers, counting and radix sort order n items in O(n) by avoiding comparisons.

## Idea
The $\Omega(n\log n)$ bound only applies to *comparison* sorts. **Counting sort** tallies how
many keys equal each value and places them directly — $O(n+u)$ for keys in $\{0,\dots,u-1\}$.
**Radix sort** applies counting sort digit by digit.

## Why it matters
Beats the comparison lower bound by exploiting structure (integer keys), giving true linear
time when keys fit in a small range — used for sorting integers, strings, and as a subroutine.

## Details
Counting sort is **stable**, which makes radix sort correct: sort by least-significant digit
first. For $n$ keys in $\{0,\dots,n^c-1\}$, radix sort runs in $O(cn)=O(n)$ for constant $c$.

## Related
[Comparison Sorting & Its Lower Bound](/portfolio/study/comparison-sorting/) · [Hash Tables (Chaining)](/portfolio/study/hash-table/)
