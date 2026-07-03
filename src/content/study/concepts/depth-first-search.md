---
type: concept
title: Depth-First Search (DFS)
lang: en
pair: "[[depth-first-search.ko]]"
course: "6.006"
lectures: [10]
summary: Explore as deep as possible before backtracking; classifies edges and exposes graph structure in O(V+E).
tags: [graphs, search]
prereqs: [[[graph-representation]]]
related: [[[breadth-first-search]], [[topological-sort]]]
source: [[[L10-depth-first-search]]]
status: draft
---
# Depth-First Search (DFS)

*(한국어: [깊이 우선 탐색 (DFS)](/portfolio/study/depth-first-search.ko/))*

> Explore as deep as possible before backtracking; classifies edges and exposes graph structure in O(V+E).

## Idea
From a vertex, recurse into an unvisited neighbor, going as deep as possible before
**backtracking**. Uses an implicit (recursion) stack. Each vertex and edge is touched once,
so $O(V+E)$.

## Why it matters
The structural workhorse: detects cycles, finds connected/strongly-connected components,
orders a DAG (topological sort), and underlies many graph algorithms.

## Details
DFS classifies edges as tree / back / forward / cross via discovery and finish times. A **back
edge** signals a cycle. Finishing-time order (reversed) gives a topological sort of a DAG.

## Related
[Breadth-First Search (BFS)](/portfolio/study/breadth-first-search/) · [Topological Sort](/portfolio/study/topological-sort/)
