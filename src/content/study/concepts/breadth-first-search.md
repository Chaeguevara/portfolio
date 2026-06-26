---
type: concept
title: Breadth-First Search (BFS)
lang: en
pair: "[[breadth-first-search.ko]]"
course: "6.006"
lectures: [9]
summary: Explore a graph in layers from a source, computing shortest paths by edge count in O(V+E).
tags: [graphs, search]
prereqs: [[[graph-representation]]]
related: [[[depth-first-search]], [[weighted-shortest-paths]], [[dag-relaxation]]]
source: [[[L09-breadth-first-search]]]
status: draft
---
# Breadth-First Search (BFS)

*(한국어: [너비 우선 탐색 (BFS)](/portfolio/study/breadth-first-search.ko/))*

> Explore a graph in layers from a source, computing shortest paths by edge count in O(V+E).

## Idea
Starting at $s$, visit all neighbors (distance 1), then their unvisited neighbors (distance 2),
and so on, using a **FIFO queue**. Mark vertices visited so each is processed once.

## Why it matters
Computes **unweighted shortest paths** (fewest edges) and the BFS tree, tests connectivity and
bipartiteness, and finds the shortest move sequence in puzzles/state graphs.

## Details
Runs in $O(V+E)$ with adjacency lists. Records a parent pointer to reconstruct paths and a
level/distance per vertex. It's the unweighted special case of the shortest-paths family.

## Related
[Depth-First Search (DFS)](/portfolio/study/depth-first-search/) · [Weighted Shortest Paths: Overview](/portfolio/study/weighted-shortest-paths/) · [DAG Shortest Paths (Relaxation)](/portfolio/study/dag-relaxation/)
