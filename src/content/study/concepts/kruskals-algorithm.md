---
type: concept
title: Kruskal's Algorithm
lang: en
pair: "[[kruskals-algorithm.ko]]"
course: "6.046J"
lectures: [4]
summary: Sort all edges and add each lightest edge that joins two different components, using union-find.
tags: [graphs, greedy]
prereqs: [[[minimum-spanning-tree]], [[union-find]]]
related: [[[prims-algorithm]], [[union-find]]]
source: [[[L04-minimum-spanning-trees-ii]]]
status: draft
---
# Kruskal's Algorithm

*(한국어: [크루스칼 알고리즘 (Kruskal's Algorithm)](/portfolio/study/kruskals-algorithm.ko/))*

> Sort all edges and add each lightest edge that joins two different components, using union-find.

## Idea
Sort edges by weight ascending. Scan them; add an edge **iff** its endpoints are in different
components (it would not form a cycle), merging the two components. Stop at $V-1$ edges.

## Why it matters
A clean greedy MST that shines on sparse graphs and is the canonical application of the
**union-find** data structure.

## Details
Cycle test = "are these two vertices already connected?" answered by union-find's `find`;
merging = `union`. Cost: $O(E\log E)$ for the sort dominates; the union-find work is nearly
linear. Correctness again from the cut property.

## Related
[Prim's Algorithm](/portfolio/study/prims-algorithm/) · [Union-Find (Disjoint Sets)](/portfolio/study/union-find/) · [Minimum Spanning Trees](/portfolio/study/minimum-spanning-tree/)
