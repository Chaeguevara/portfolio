---
type: concept
title: Planar Graphs & Euler's Formula
lang: en
pair: "[[planar-graphs.ko]]"
course: "6.042J"
lectures: [10]
summary: A planar graph can be drawn without crossings; vertices, edges and faces satisfy v - e + f = 2.
tags: [graph-theory]
prereqs: [[[graphs-basics]]]
related: [[[graph-coloring]]]
source: [[[L10-graph-theory-iii]]]
status: draft
---
# Planar Graphs & Euler's Formula

*(한국어: [평면 그래프와 오일러 공식 (Planar Graphs, Euler's Formula)](/portfolio/study/planar-graphs.ko/))*

> A planar graph can be drawn without crossings; vertices, edges and faces satisfy v - e + f = 2.

## Idea
A graph is **planar** if it can be drawn in the plane with no edges crossing. Such a drawing
splits the plane into **faces**; **Euler's formula** says $v-e+f=2$ for any connected planar
drawing.

## Why it matters
A rigidity that bounds how many edges a planar graph can have ($e\le 3v-6$), forces a
low-degree vertex, and yields short proofs that $K_5$ and $K_{3,3}$ are non-planar and that
planar graphs are 5-colorable.

## Details
From $e\le 3v-6$ every planar graph has a vertex of degree $\le 5$; inducting on it gives the
5-color theorem. The full 4-color theorem needs a computer-assisted proof.

## Related
[Graph Coloring](/portfolio/study/graph-coloring/) · [Graphs: Walks, Paths & Connectivity](/portfolio/study/graphs-basics/)
