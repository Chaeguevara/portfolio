---
type: concept
title: DAG Shortest Paths (Relaxation)
lang: en
pair: "[[dag-relaxation.ko]]"
course: "6.006"
lectures: [11]
summary: On a DAG, relaxing edges in topological order gives shortest paths in O(V+E), even with negative weights.
tags: [graphs, shortest-paths]
prereqs: [[[topological-sort]]]
related: [[[weighted-shortest-paths]], [[dynamic-programming]]]
source: [[[L11-weighted-shortest-paths]]]
status: draft
---
# DAG Shortest Paths (Relaxation)

*(한국어: [DAG 최단 경로 (완화) (DAG Relaxation)](/portfolio/study/dag-relaxation.ko/))*

> On a DAG, relaxing edges in topological order gives shortest paths in O(V+E), even with negative weights.

## Idea
Topologically sort the DAG, then process vertices in that order, relaxing all outgoing edges.
Because every predecessor is finalized before a vertex is processed, one pass suffices.

## Why it matters
The fastest shortest-path algorithm — linear time — and the structural template for **dynamic
programming**: subproblems form a DAG, and DP relaxes them in topological order.

## Details
Handles **negative edge weights** with no penalty (a DAG can't have a negative cycle). The DP
view: $d[v]=\min_{u\to v}\big(d[u]+w(u,v)\big)$ evaluated in topological order.

## Related
[Weighted Shortest Paths: Overview](/portfolio/study/weighted-shortest-paths/) · [Topological Sort](/portfolio/study/topological-sort/) · [Dynamic Programming (SRTBOT)](/portfolio/study/dynamic-programming/)
