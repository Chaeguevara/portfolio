---
type: concept
title: Graph Coloring
lang: en
pair: "[[graph-coloring.ko]]"
course: "6.042J"
lectures: [6, 10]
summary: Assign colors to vertices so adjacent ones differ; the minimum number needed is the chromatic number.
tags: [graph-theory]
prereqs: [[[graphs-basics]]]
related: [[[planar-graphs]], [[bipartite-matching]]]
source: [[[L06-graph-theory-and-coloring]], [[L10-graph-theory-iii]]]
status: draft
---
# Graph Coloring

*(한국어: [그래프 색칠 (Graph Coloring)](/portfolio/study/graph-coloring.ko/))*

> Assign colors to vertices so adjacent ones differ; the minimum number needed is the chromatic number.

## Idea
A **proper coloring** gives adjacent vertices different colors. The **chromatic number**
$\chi(G)$ is the fewest colors that work. $\chi(G)=2$ iff $G$ is **bipartite** (no odd cycle).

## Why it matters
Models conflict-free scheduling: exams, registers, frequencies — items that clash get
different "colors" (time slots, registers, channels).

## Details
Greedy coloring uses $\le \Delta+1$ colors ($\Delta$ = max degree). Planar graphs need
$\le 4$ (Four Color Theorem); the 5-color bound has an elementary proof via Euler's formula.

## Related
[Planar Graphs & Euler's Formula](/portfolio/study/planar-graphs/) · [Bipartite Matching & Hall's Theorem](/portfolio/study/bipartite-matching/) · [Graphs: Walks, Paths & Connectivity](/portfolio/study/graphs-basics/)
