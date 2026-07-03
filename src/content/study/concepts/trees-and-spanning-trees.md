---
type: concept
title: Trees & Spanning Trees
lang: en
pair: "[[trees-and-spanning-trees.ko]]"
course: "6.042J"
lectures: [8]
summary: A tree is a connected acyclic graph with n-1 edges; a spanning tree connects all vertices of a graph minimally.
tags: [graph-theory, trees]
prereqs: [[[graphs-basics]]]
related: [[[minimum-spanning-tree]], [[graphs-basics]]]
source: [[[L08-graph-theory-ii-minimum-spanning-trees]]]
status: draft
---
# Trees & Spanning Trees

*(한국어: [트리와 신장 트리 (Trees & Spanning Trees)](/portfolio/study/trees-and-spanning-trees.ko/))*

> A tree is a connected acyclic graph with n-1 edges; a spanning tree connects all vertices of a graph minimally.

## Idea
A **tree** on $n$ vertices is connected, has no cycle, and has exactly $n-1$ edges — any two
of those three properties imply the third. A **spanning tree** of $G$ is a subgraph that is a
tree touching every vertex.

## Why it matters
Trees are the minimal connected structures (remove any edge and they disconnect). Spanning
trees are the backbone of network design and the object MST algorithms optimize.

## Details
Every connected graph has a spanning tree (delete edges from cycles). Adding one edge to a
tree creates exactly one cycle; this **cycle property** is what greedy MST algorithms exploit.

## Related
[Minimum Spanning Trees](/portfolio/study/minimum-spanning-tree/) · [Graphs: Walks, Paths & Connectivity](/portfolio/study/graphs-basics/)
