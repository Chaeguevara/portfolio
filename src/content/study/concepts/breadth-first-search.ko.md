---
type: concept
title: 너비 우선 탐색 (BFS)
lang: ko
pair: "[[breadth-first-search]]"
course: "6.006"
lectures: [9]
summary: 소스에서 층별로 그래프를 탐색해 간선 수 기준 최단 경로를 O(V+E)에 구한다.
tags: [graphs, search]
prereqs: [[[graph-representation.ko]]]
related: [[[depth-first-search.ko]], [[weighted-shortest-paths.ko]], [[dag-relaxation.ko]]]
source: [[[L09-breadth-first-search]]]
status: draft
---
# 너비 우선 탐색 (BFS)

*(English: [Breadth-First Search (BFS)](/portfolio/study/breadth-first-search/))*

> 소스에서 층별로 그래프를 탐색해 간선 수 기준 최단 경로를 O(V+E)에 구한다.

## 개념
$s$ 에서 시작해 모든 이웃(거리 1), 그 다음 그들의 미방문 이웃(거리 2)을 **FIFO 큐** 로
방문한다. 방문 표시로 각 정점을 한 번만 처리한다.

## 왜 중요한가
**무가중치 최단 경로**(최소 간선 수)와 BFS 트리를 구하고, 연결성·이분성을 검사하며, 퍼즐/상태
그래프에서 최소 이동열을 찾는다.

## 세부
인접 리스트로 $O(V+E)$. 부모 포인터로 경로를 복원하고 정점별 레벨/거리를 기록한다. 최단 경로
계열의 무가중치 특수 경우다.

## 관련
[깊이 우선 탐색 (DFS)](/portfolio/study/depth-first-search.ko/) · [가중치 최단 경로: 개요 (Weighted Shortest Paths)](/portfolio/study/weighted-shortest-paths.ko/) · [DAG 최단 경로 (완화) (DAG Relaxation)](/portfolio/study/dag-relaxation.ko/)
