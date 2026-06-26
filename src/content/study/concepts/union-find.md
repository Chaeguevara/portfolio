---
type: concept
title: Union-Find (Disjoint Sets)
lang: en
pair: "[[union-find.ko]]"
course: "6.046J"
lectures: [4, 16]
summary: Maintain disjoint sets with near-constant find/union via union-by-rank and path compression.
tags: [data-structures]
prereqs: []
related: [[[kruskals-algorithm]], [[amortized-analysis]]]
source: [[[L04-minimum-spanning-trees-ii]], [[L16-disjoint-set-data-structures]]]
status: draft
---
# Union-Find (Disjoint Sets)

*(한국어: [유니온-파인드 (서로소 집합) (Union-Find)](/portfolio/study/union-find.ko/))*

> Maintain disjoint sets with near-constant find/union via union-by-rank and path compression.

## Idea
Support `make-set`, `find` (which set is $x$ in?), and `union` (merge two sets). Represent each
set as a tree of parent pointers; `find` returns the root. Two optimizations keep trees flat.

## Why it matters
The backbone of Kruskal's MST, connectivity queries, and incremental clustering — and a
showcase of how tiny tweaks yield a near-linear amortized bound.

## Details
**Union by rank:** attach the shorter tree under the taller. **Path compression:** point every
node visited by `find` directly at the root. Together, $m$ operations cost $O(m\,\alpha(n))$
where $\alpha$ (inverse Ackermann) is $\le 4$ for all practical $n$.

## Related
[Kruskal's Algorithm](/portfolio/study/kruskals-algorithm/) · [Amortized Analysis](/portfolio/study/amortized-analysis/)
