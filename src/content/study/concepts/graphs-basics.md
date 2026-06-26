---
type: concept
title: "Graphs: Walks, Paths & Connectivity"
lang: en
pair: "[[graphs-basics.ko]]"
course: "6.042J"
lectures: [6]
summary: A graph is vertices joined by edges; walks, paths, cycles and connectivity describe how to move through it.
tags: [graph-theory]
prereqs: []
related: [[[graph-coloring]], [[trees-and-spanning-trees]], [[bipartite-matching]]]
source: [[[L06-graph-theory-and-coloring]]]
status: draft
---
Graphs: Walks, Paths & Connectivity

*(한국어: [그래프 기초: 보행·경로·연결성](/portfolio/study/graphs-basics.ko/))*

> A graph is vertices joined by edges; walks, paths, cycles and connectivity describe how to move through it.

## Idea
$G=(V,E)$. A **walk** is a sequence of adjacent vertices; a **path** repeats no vertex; a
**cycle** is a closed path. $G$ is **connected** if a path joins every pair. The **degree**
of a vertex is its edge count; $\sum_v \deg(v)=2|E|$ (handshake lemma).

## Why it matters
The shared vocabulary for networks, dependencies, maps, and circuits — every later graph
result (coloring, matching, trees, planarity) builds on it.

## Details
Connected components partition $V$. An Eulerian walk uses every edge once (exists iff $\le 2$
odd-degree vertices); a Hamiltonian path visits every vertex once (hard in general).

## Related
[Graph Coloring](/portfolio/study/graph-coloring/) · [Trees & Spanning Trees](/portfolio/study/trees-and-spanning-trees/) · [Bipartite Matching & Hall's Theorem](/portfolio/study/bipartite-matching/)
