---
type: concept
title: Topological Sort
lang: en
pair: "[[topological-sort.ko]]"
course: "6.006"
lectures: [10]
summary: Linearly order a DAG so every edge points forward; the prerequisite of DAG dynamic programming.
tags: [graphs]
prereqs: [[[depth-first-search]]]
related: [[[dag-relaxation]], [[relations-and-partial-orders]]]
source: [[[L10-depth-first-search]]]
status: draft
---
# Topological Sort

*(한국어: [위상 정렬 (Topological Sort)](/portfolio/study/topological-sort.ko/))*

> Linearly order a DAG so every edge points forward; the prerequisite of DAG dynamic programming.

## Idea
For a **directed acyclic graph (DAG)**, a topological order lists the vertices so that for
every edge $u\to v$, $u$ comes before $v$. Found by DFS (reverse finish order) or by
repeatedly removing a source (Kahn's algorithm), in $O(V+E)$.

## Why it matters
Any process with dependencies — course prerequisites, build systems, task scheduling — needs a
valid order. It's also the "topological order" step that makes dynamic programming well-defined.

## Details
A topological order exists **iff** the graph is acyclic (a cycle has no valid order). It need
not be unique. DAG shortest paths and DP both relax subproblems in this order.

## Related
[DAG Shortest Paths (Relaxation)](/portfolio/study/dag-relaxation/) · [Depth-First Search (DFS)](/portfolio/study/depth-first-search/) · [Relations & Partial Orders](/portfolio/study/relations-and-partial-orders/)
