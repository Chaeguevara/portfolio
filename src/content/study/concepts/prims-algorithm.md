---
type: concept
title: Prim's Algorithm
lang: en
pair: "[[prims-algorithm.ko]]"
course: "6.046J"
lectures: [3]
summary: Grow an MST from one vertex, repeatedly adding the cheapest edge leaving the current tree via a priority queue.
tags: [graphs, greedy]
prereqs: [[[minimum-spanning-tree]], [[binary-heap]]]
related: [[[kruskals-algorithm]], [[dijkstra]]]
source: [[[L03-minimum-spanning-trees-i]]]
status: draft
---
# Prim's Algorithm

*(한국어: [프림 알고리즘 (Prim's Algorithm)](/portfolio/study/prims-algorithm.ko/))*

> Grow an MST from one vertex, repeatedly adding the cheapest edge leaving the current tree via a priority queue.

## Idea
Start with one vertex. Maintain a **min-priority queue** of edges (or vertices keyed by
cheapest connecting edge) crossing from the tree to the rest. Repeatedly add the lightest such
edge, absorbing its endpoint into the tree.

## Why it matters
The MST analogue of Dijkstra — same priority-queue structure — efficient on dense graphs and
intuitive as "always extend by the cheapest available connection".

## Details
Each step applies the cut property (tree vs rest). With a binary heap $O(E\log V)$; with a
Fibonacci heap $O(E+V\log V)$. Differs from Dijkstra only in the key (edge weight vs path
distance).

## Related
[Kruskal's Algorithm](/portfolio/study/kruskals-algorithm/) · [Minimum Spanning Trees](/portfolio/study/minimum-spanning-tree/) · [Dijkstra's Algorithm](/portfolio/study/dijkstra/)
