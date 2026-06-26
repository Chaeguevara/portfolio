---
type: concept
title: Dynamic Arrays
lang: en
pair: "[[dynamic-array.ko]]"
course: "6.006"
lectures: [2]
summary: A resizable array that doubles capacity when full, giving O(1) amortized append with O(1) indexing.
tags: [data-structures]
prereqs: [[[word-ram-model]]]
related: [[[data-structure-interfaces]], [[amortized-analysis]]]
source: [[[L02-data-structures-and-dynamic-arrays]]]
status: draft
---
# Dynamic Arrays

*(한국어: [동적 배열 (Dynamic Arrays)](/portfolio/study/dynamic-array.ko/))*

> A resizable array that doubles capacity when full, giving O(1) amortized append with O(1) indexing.

## Idea
A fixed array gives $O(1)$ indexing but a fixed size. A **dynamic array** keeps a backing
array; when it fills, allocate a **double-size** array and copy. Append is usually $O(1)$, and
occasionally $O(n)$ on a resize.

## Why it matters
Combines the random-access speed of arrays with growable size — the default list in most
languages (Python `list`, C++ `vector`) — and the simplest illustration of amortization.

## Details
**Amortized analysis:** over $n$ appends, total copying is $1+2+4+\dots+n=O(n)$, so the
amortized cost per append is $O(1)$. Doubling (not adding a constant) is essential; growing by
a fixed amount gives $\Theta(n)$ amortized.

## Related
[Set vs Sequence Interfaces](/portfolio/study/data-structure-interfaces/) · [Amortized Analysis](/portfolio/study/amortized-analysis/) · [The Word-RAM Model](/portfolio/study/word-ram-model/)
