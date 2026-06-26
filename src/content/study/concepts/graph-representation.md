---
type: concept
title: Graph Representations
lang: en
pair: "[[graph-representation.ko]]"
course: "6.006"
lectures: [9]
summary: Store a graph as adjacency lists (sparse-friendly) or an adjacency matrix (dense, O(1) edge test).
tags: [graphs]
prereqs: [[[data-structure-interfaces]]]
related: [[[breadth-first-search]], [[depth-first-search]], [[graphs-basics]]]
source: [[[L09-breadth-first-search]]]
status: draft
---
# Graph Representations

*(한국어: [그래프 표현 (Graph Representations)](/portfolio/study/graph-representation.ko/))*

> Store a graph as adjacency lists (sparse-friendly) or an adjacency matrix (dense, O(1) edge test).

## Idea
- **Adjacency list:** each vertex stores a list/set of its neighbors. Space $O(V+E)$;
  iterate a vertex's edges in $O(\deg)$.
- **Adjacency matrix:** a $V\times V$ array; $A[u][v]=1$ if edge. Space $O(V^2)$; $O(1)$
  edge-existence test.

## Why it matters
The representation sets the cost of every graph algorithm. BFS/DFS run in $O(V+E)$ on
adjacency lists — the right choice for the sparse graphs most problems have.

## Details
Adjacency lists win when $E\ll V^2$ (most real graphs). Matrices win for dense graphs and
algorithms doing many edge-existence checks or matrix operations (e.g. APSP via matrix mult).

## Related
[Breadth-First Search (BFS)](/portfolio/study/breadth-first-search/) · [Depth-First Search (DFS)](/portfolio/study/depth-first-search/) · [Graphs: Walks, Paths & Connectivity](/portfolio/study/graphs-basics/)
