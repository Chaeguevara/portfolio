---
type: concept
title: Merge Sort
lang: en
pair: "[[merge-sort.ko]]"
course: "6.006"
lectures: [3]
summary: Divide the array in half, sort each recursively, and merge the sorted halves in linear time — O(n log n).
tags: [sorting, divide-and-conquer]
prereqs: [[[comparison-sorting]]]
related: [[[divide-and-conquer-recurrences]], [[comparison-sorting]]]
source: [[[L03-sets-and-sorting]]]
status: draft
---
# Merge Sort

*(한국어: [병합 정렬 (Merge Sort)](/portfolio/study/merge-sort.ko/))*

> Divide the array in half, sort each recursively, and merge the sorted halves in linear time — O(n log n).

## Idea
**Divide:** split into two halves. **Conquer:** sort each by recursion. **Combine:** merge two
sorted lists by repeatedly taking the smaller front element. Merging $n$ items is $O(n)$.

## Why it matters
The canonical optimal comparison sort: $\Theta(n\log n)$ worst-case, stable, and a clean
divide-and-conquer template that generalizes (counting inversions, external sorting).

## Details
Recurrence $T(n)=2T(n/2)+\Theta(n)$ solves to $\Theta(n\log n)$ by the master theorem. Uses
$O(n)$ extra space for the merge (unlike in-place heapsort). Stable: equal keys keep order.

## Related
[Divide-and-Conquer Recurrences & Master Theorem](/portfolio/study/divide-and-conquer-recurrences/) · [Comparison Sorting & Its Lower Bound](/portfolio/study/comparison-sorting/)
