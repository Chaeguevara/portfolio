---
type: concept
title: 깊이 우선 탐색 (DFS)
lang: ko
pair: "[[depth-first-search]]"
course: "6.006"
lectures: [10]
summary: 가능한 한 깊이 들어간 뒤 되돌아오며, 간선을 분류하고 그래프 구조를 O(V+E)에 드러낸다.
tags: [graphs, search]
prereqs: [[[graph-representation.ko]]]
related: [[[breadth-first-search.ko]], [[topological-sort.ko]]]
source: [[[L10-depth-first-search]]]
status: draft
---
# 깊이 우선 탐색 (DFS)

*(English: [Depth-First Search (DFS)](/portfolio/study/depth-first-search/))*

> 가능한 한 깊이 들어간 뒤 되돌아오며, 간선을 분류하고 그래프 구조를 O(V+E)에 드러낸다.

## 개념
한 정점에서 미방문 이웃으로 재귀해 가능한 깊이 들어간 뒤 **되돌아온다(backtrack)**. 암묵적
(재귀) 스택을 쓴다. 각 정점·간선을 한 번 만지므로 $O(V+E)$.

## 왜 중요한가
구조의 주력이다: 순환 탐지, 연결/강연결 성분 찾기, DAG 정렬(위상 정렬), 많은 그래프 알고리즘의
기반.

## 세부
DFS 는 발견·종료 시간으로 간선을 트리/뒤/앞/교차로 분류한다. **뒤 간선(back edge)** 은 순환을
뜻한다. 종료 시간 역순이 DAG 의 위상 정렬을 준다.

## 관련
[너비 우선 탐색 (BFS)](/portfolio/study/breadth-first-search.ko/) · [위상 정렬 (Topological Sort)](/portfolio/study/topological-sort.ko/)
