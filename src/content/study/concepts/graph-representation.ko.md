---
type: concept
title: 그래프 표현 (Graph Representations)
lang: ko
pair: "[[graph-representation]]"
course: "6.006"
lectures: [9]
summary: 그래프를 인접 리스트(희소에 유리)나 인접 행렬(밀집, O(1) 간선 검사)로 저장한다.
tags: [graphs]
prereqs: [[[data-structure-interfaces.ko]]]
related: [[[breadth-first-search.ko]], [[depth-first-search.ko]], [[graphs-basics.ko]]]
source: [[[L09-breadth-first-search]]]
status: draft
---
# 그래프 표현 (Graph Representations)

*(English: [Graph Representations](/portfolio/study/graph-representation/))*

> 그래프를 인접 리스트(희소에 유리)나 인접 행렬(밀집, O(1) 간선 검사)로 저장한다.

## 개념
- **인접 리스트:** 각 정점이 이웃 리스트/집합을 저장. 공간 $O(V+E)$; 정점의 간선 순회
  $O(\deg)$.
- **인접 행렬:** $V\times V$ 배열; 간선 있으면 $A[u][v]=1$. 공간 $O(V^2)$; $O(1)$ 간선 존재
  검사.

## 왜 중요한가
표현이 모든 그래프 알고리즘의 비용을 정한다. BFS/DFS 는 인접 리스트에서 $O(V+E)$ 로 동작 —
대부분 문제의 희소 그래프에 맞는 선택이다.

## 세부
$E\ll V^2$ (대부분 실제 그래프)이면 인접 리스트가 유리. 밀집 그래프나 간선 존재 검사·행렬
연산(예: 행렬곱 APSP)이 많은 알고리즘엔 행렬이 유리.

## 관련
[너비 우선 탐색 (BFS)](/portfolio/study/breadth-first-search.ko/) · [깊이 우선 탐색 (DFS)](/portfolio/study/depth-first-search.ko/) · [그래프 기초: 보행·경로·연결성](/portfolio/study/graphs-basics.ko/)
