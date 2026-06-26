---
type: concept
title: Binary Heaps & Priority Queues
lang: en
pair: "[[binary-heap.ko]]"
course: "6.006"
lectures: [8]
summary: An array-based near-complete tree with the heap property, giving O(log n) insert and extract-min/max.
tags: [data-structures, trees]
prereqs: [[[data-structure-interfaces]]]
related: [[[dijkstra]], [[binary-search-tree]]]
source: [[[L08-binary-heaps]]]
status: draft
---
# Binary Heaps & Priority Queues

*(한국어: [이진 힙과 우선순위 큐 (Binary Heaps, Priority Queues)](/portfolio/study/binary-heap.ko/))*

> An array-based near-complete tree with the heap property, giving O(log n) insert and extract-min/max.

## Idea
A **binary heap** is a complete binary tree (stored implicitly in an array) where each parent
is $\le$ (min-heap) its children. The min is at the root. **Insert** bubbles up and
**extract-min** swaps the last leaf to the root and sinks down — each $O(\log n)$.

## Why it matters
The standard **priority queue**: repeatedly grab the smallest/largest pending item. It powers
Dijkstra, Prim, heapsort, event simulation, and scheduling.

## Details
Array layout: node $i$'s children are $2i{+}1,2i{+}2$. Building a heap from $n$ items is
$O(n)$ (not $n\log n$). **Heapsort** repeatedly extracts to sort in-place in $O(n\log n)$.

## Related
[Dijkstra's Algorithm](/portfolio/study/dijkstra/) · [Binary Search Trees](/portfolio/study/binary-search-tree/) · [Set vs Sequence Interfaces](/portfolio/study/data-structure-interfaces/)
