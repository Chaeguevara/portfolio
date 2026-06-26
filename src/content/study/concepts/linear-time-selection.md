---
type: concept
title: Linear-Time Selection (Median of Medians)
lang: en
pair: "[[linear-time-selection.ko]]"
course: "6.046J"
lectures: [1]
summary: Find the k-th smallest element in worst-case O(n) by choosing a provably good pivot via medians of groups.
tags: [divide-and-conquer, selection]
prereqs: []
related: [[[randomized-algorithms]]]
source: [[[L01-introduction-median-finding]]]
status: draft
---
# Linear-Time Selection (Median of Medians)

*(한국어: [선형 시간 선택 (중앙값들의 중앙값)](/portfolio/study/linear-time-selection.ko/))*

> Find the k-th smallest element in worst-case O(n) by choosing a provably good pivot via medians of groups.

## Idea
**Selection** finds the $k$-th smallest without fully sorting. Partition around a pivot
(like quicksort) and recurse into the side containing rank $k$. The trick is a pivot that
always discards a constant fraction.

## Why it matters
Beats sorting ($\Theta(n\log n)$) for finding a median or order statistic, and shows how a
careful pivot choice converts a randomized expectation into a worst-case guarantee.

## Details
**Median of medians:** split into groups of 5, take each group's median, recursively select
the median of those. It guarantees $\ge 3/10$ of elements are discarded, giving
$T(n)=T(n/5)+T(7n/10)+O(n)=O(n)$. Randomized quickselect is $O(n)$ expected and simpler.

## Related
[Randomized Algorithms](/portfolio/study/randomized-algorithms/)
