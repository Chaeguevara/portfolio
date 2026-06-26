---
type: concept
title: Johnson's Algorithm
lang: en
pair: "[[johnsons-algorithm.ko]]"
course: "6.046J"
lectures: [7]
summary: "All-pairs shortest paths on sparse graphs: reweight with Bellman-Ford to remove negatives, then run Dijkstra from each vertex."
tags: [graphs, shortest-paths]
prereqs: [[[bellman-ford]], [[dijkstra]]]
related: [[[floyd-warshall]], [[bellman-ford]], [[dijkstra]]]
source: [[[L07-all-pairs-shortest-paths-ii]]]
status: draft
---
Johnson's Algorithm

*(한국어: [존슨 알고리즘 (Johnson's Algorithm)](/portfolio/study/johnsons-algorithm.ko/))*

> All-pairs shortest paths on sparse graphs: reweight with Bellman-Ford to remove negatives, then run Dijkstra from each vertex.

## Idea
Add a virtual source connected to all vertices with 0-weight edges; run **Bellman-Ford** to get
a potential $h(v)$. Reweight each edge $w'(u,v)=w(u,v)+h(u)-h(v)\ge 0$. Now run **Dijkstra**
from every vertex on the nonnegative weights, then undo the reweighting.

## Why it matters
Beats Floyd-Warshall on **sparse** graphs while still handling negative edges — the best
general APSP for $E\ll V^2$.

## Details
The potential trick preserves shortest paths and makes all reweighted edges nonnegative.
Total time $O(VE + V^2\log V)$: one Bellman-Ford plus $V$ Dijkstras. Detects negative cycles in
the Bellman-Ford phase.

## Related
[Floyd–Warshall Algorithm](/portfolio/study/floyd-warshall/) · [Bellman–Ford Algorithm](/portfolio/study/bellman-ford/) · [Dijkstra's Algorithm](/portfolio/study/dijkstra/)
