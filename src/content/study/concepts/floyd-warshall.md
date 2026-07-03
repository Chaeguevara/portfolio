---
type: concept
title: Floyd–Warshall Algorithm
lang: en
pair: "[[floyd-warshall.ko]]"
course: "6.046J"
lectures: [7]
summary: All-pairs shortest paths in O(V^3) by a DP that allows intermediate vertices one at a time.
tags: [graphs, shortest-paths, dynamic-programming]
prereqs: [[[apsp-dynamic-programming]]]
related: [[[johnsons-algorithm]]]
source: [[[L07-all-pairs-shortest-paths-ii]]]
status: draft
---
# Floyd–Warshall Algorithm

*(한국어: [플로이드–워셜 알고리즘 (Floyd–Warshall)](/portfolio/study/floyd-warshall.ko/))*

> All-pairs shortest paths in O(V^3) by a DP that allows intermediate vertices one at a time.

## Idea
Number the vertices. Let $d^{(k)}_{ij}$ be the shortest $i\to j$ path using only intermediate
vertices from $\{1,\dots,k\}$. Then
$d^{(k)}_{ij}=\min\big(d^{(k-1)}_{ij},\;d^{(k-1)}_{ik}+d^{(k-1)}_{kj}\big)$ — either skip $k$
or route through it.

## Why it matters
Dead-simple triple loop, handles **negative edges** (no negative cycle), and gives all
pairwise distances in cubic time — the go-to for dense graphs.

## Details
Three nested loops over $k,i,j$, updatable in place, $O(V^3)$ time and $O(V^2)$ space. Store a
predecessor matrix to reconstruct paths. A negative diagonal entry signals a negative cycle.

## Related
[All-Pairs Shortest Paths via DP](/portfolio/study/apsp-dynamic-programming/) · [Johnson's Algorithm](/portfolio/study/johnsons-algorithm/)
