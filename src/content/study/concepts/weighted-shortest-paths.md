---
type: concept
title: "Weighted Shortest Paths: Overview"
lang: en
pair: "[[weighted-shortest-paths.ko]]"
course: "6.006"
lectures: [11]
summary: Find minimum-weight paths from a source; the right algorithm depends on edge signs and graph shape.
tags: [graphs, shortest-paths]
prereqs: [[[breadth-first-search]]]
related: [[[dag-relaxation]], [[bellman-ford]], [[dijkstra]]]
source: [[[L11-weighted-shortest-paths]]]
status: draft
---
Weighted Shortest Paths: Overview

*(한국어: [가중치 최단 경로: 개요 (Weighted Shortest Paths)](/portfolio/study/weighted-shortest-paths.ko/))*

> Find minimum-weight paths from a source; the right algorithm depends on edge signs and graph shape.

## Idea
Single-source shortest paths: compute $\delta(s,v)$, the minimum total edge weight from $s$ to
each $v$. The unifying operation is **relaxation**: if $d[u]+w(u,v)<d[v]$, update $d[v]$.

## Why it matters
A decision framework: pick the algorithm by the graph. Negative-weight cycles make shortest
paths undefined; detecting them matters (arbitrage, infeasibility).

## Details
Choose by structure: **DAG** $\to$ relax in topological order, $O(V+E)$; **nonnegative
weights** $\to$ Dijkstra, $O(E+V\log V)$; **general (negative edges)** $\to$ Bellman-Ford,
$O(VE)$, which also reports a negative cycle.

## Diagram

```mermaid
flowchart TD
    G["weighted graph"] --> A["DAG? -> DAG relaxation O(V+E)"]
    G --> B["nonneg weights? -> Dijkstra O(E + V log V)"]
    G --> C["negative edges? -> Bellman-Ford O(V*E)"]
    C --> D["detects negative cycles"]
```

## Related
[DAG Shortest Paths (Relaxation)](/portfolio/study/dag-relaxation/) · [Bellman–Ford Algorithm](/portfolio/study/bellman-ford/) · [Dijkstra's Algorithm](/portfolio/study/dijkstra/)
