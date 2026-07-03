---
type: concept
title: Minimum Spanning Trees
lang: en
pair: "[[minimum-spanning-tree.ko]]"
course: "6.046J"
lectures: [3, 4]
summary: The cheapest set of edges connecting all vertices; greedy works thanks to the cut property.
tags: [graphs, greedy]
prereqs: [[[greedy-algorithms]]]
related: [[[prims-algorithm]], [[kruskals-algorithm]], [[trees-and-spanning-trees]]]
source: [[[L03-minimum-spanning-trees-i]], [[L04-minimum-spanning-trees-ii]]]
status: draft
---
# Minimum Spanning Trees

*(한국어: [최소 신장 트리 (Minimum Spanning Trees)](/portfolio/study/minimum-spanning-tree.ko/))*

> The cheapest set of edges connecting all vertices; greedy works thanks to the cut property.

## Idea
Given a weighted connected graph, the **MST** is a spanning tree of minimum total edge weight.
Both classic algorithms are greedy, justified by the **cut property**: for any partition of the
vertices, the lightest edge crossing it belongs to some MST.

## Why it matters
Models least-cost network design (cables, roads, clustering). It's the headline example where
greedy provably yields the global optimum.

## Details
The dual **cycle property:** the heaviest edge on any cycle is in no MST. Prim grows one tree;
Kruskal adds globally-lightest safe edges using union-find. Both run in
$O(E\log V)$.

## Diagram

```mermaid
flowchart TD
    G["weighted connected graph"] --> CUT["Cut property"]
    CUT --> SAFE["the lightest edge crossing any cut is in some MST"]
    SAFE --> P["Prim: grow one tree from a vertex"]
    SAFE --> K["Kruskal: add lightest edge that joins two components"]
```

## Related
[Prim's Algorithm](/portfolio/study/prims-algorithm/) · [Kruskal's Algorithm](/portfolio/study/kruskals-algorithm/) · [Trees & Spanning Trees](/portfolio/study/trees-and-spanning-trees/)
