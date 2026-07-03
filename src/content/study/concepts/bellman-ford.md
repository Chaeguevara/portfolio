---
type: concept
title: Bellman–Ford Algorithm
lang: en
pair: "[[bellman-ford.ko]]"
course: "6.006"
lectures: [12]
summary: Relax all edges V-1 times to find shortest paths with negative weights, and detect negative cycles.
tags: [graphs, shortest-paths]
prereqs: [[[weighted-shortest-paths]]]
related: [[[dijkstra]], [[johnsons-algorithm]]]
source: [[[L12-bellman-ford]]]
status: draft
---
# Bellman–Ford Algorithm

*(한국어: [벨만–포드 알고리즘 (Bellman–Ford)](/portfolio/study/bellman-ford.ko/))*

> Relax all edges V-1 times to find shortest paths with negative weights, and detect negative cycles.

## Idea
Repeat $V-1$ times: relax **every** edge. Since any shortest path has at most $V-1$ edges,
$V-1$ rounds settle all distances. A $V$-th round that still improves something reveals a
**negative-weight cycle**.

## Why it matters
The general-purpose single-source algorithm: it's the one that works with **negative edge
weights** (where Dijkstra fails) and certifies when no finite answer exists.

## Details
Runs in $O(VE)$. Correctness is an induction: after round $k$, all shortest paths using
$\le k$ edges are correct. It's the relaxation engine reused inside Johnson's all-pairs
algorithm.

## Related
[Dijkstra's Algorithm](/portfolio/study/dijkstra/) · [Weighted Shortest Paths: Overview](/portfolio/study/weighted-shortest-paths/) · [Johnson's Algorithm](/portfolio/study/johnsons-algorithm/)
