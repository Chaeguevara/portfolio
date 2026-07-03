---
type: concept
title: All-Pairs Shortest Paths via DP
lang: en
pair: "[[apsp-dynamic-programming.ko]]"
course: "6.046J"
lectures: [6]
summary: Compute shortest paths between every pair by a DP over path length, like repeated matrix multiplication.
tags: [graphs, shortest-paths, dynamic-programming]
prereqs: [[[bellman-ford]]]
related: [[[floyd-warshall]], [[johnsons-algorithm]]]
source: [[[L06-all-pairs-shortest-paths-i]]]
status: draft
---
# All-Pairs Shortest Paths via DP

*(한국어: [동적 계획법 기반 전쌍 최단 경로 (APSP via DP)](/portfolio/study/apsp-dynamic-programming.ko/))*

> Compute shortest paths between every pair by a DP over path length, like repeated matrix multiplication.

## Idea
Let $d^{(m)}_{ij}$ be the shortest $i\to j$ path using $\le m$ edges. The recurrence
$d^{(m)}_{ij}=\min_k\big(d^{(m-1)}_{ik}+w_{kj}\big)$ mirrors matrix multiplication with
$(\min,+)$ in place of $(+,\times)$.

## Why it matters
Frames APSP as a clean DP / algebraic structure and motivates the faster specialized
algorithms. Useful when you need distances between **all** pairs, not just from one source.

## Details
Naively $O(V^4)$; by **repeated squaring** of the $(\min,+)$ matrix, $O(V^3\log V)$. Both are
beaten by Floyd-Warshall ($O(V^3)$) and, for sparse graphs, Johnson's.

## Related
[Floyd–Warshall Algorithm](/portfolio/study/floyd-warshall/) · [Johnson's Algorithm](/portfolio/study/johnsons-algorithm/) · [Bellman–Ford Algorithm](/portfolio/study/bellman-ford/)
