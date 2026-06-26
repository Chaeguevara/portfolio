---
type: concept
title: 프림 알고리즘 (Prim's Algorithm)
lang: ko
pair: "[[prims-algorithm]]"
course: "6.046J"
lectures: [3]
summary: 한 정점에서 MST를 키우며, 우선순위 큐로 현재 트리를 떠나는 가장 싼 간선을 반복 추가한다.
tags: [graphs, greedy]
prereqs: [[[minimum-spanning-tree.ko]], [[binary-heap.ko]]]
related: [[[kruskals-algorithm.ko]], [[dijkstra.ko]]]
source: [[[L03-minimum-spanning-trees-i]]]
status: draft
---
# 프림 알고리즘 (Prim's Algorithm)

*(English: [Prim's Algorithm](/portfolio/study/prims-algorithm/))*

> 한 정점에서 MST를 키우며, 우선순위 큐로 현재 트리를 떠나는 가장 싼 간선을 반복 추가한다.

## 개념
한 정점에서 시작. 트리에서 나머지로 가로지르는 간선(또는 가장 싼 연결 간선으로 키를 매긴 정점)의
**최소 우선순위 큐** 를 유지한다. 그런 가장 가벼운 간선을 반복 추가하며 그 끝점을 트리에
흡수한다.

## 왜 중요한가
Dijkstra 의 MST 판 — 같은 우선순위 큐 구조 — 으로 밀집 그래프에 효율적이고 "항상 가장 싼 연결로
확장"이라는 직관이 명확하다.

## 세부
각 단계가 절단 성질(트리 대 나머지)을 적용한다. 이진 힙으로 $O(E\log V)$, 피보나치 힙으로
$O(E+V\log V)$. Dijkstra 와는 키(간선 가중치 대 경로 거리)만 다르다.

## 관련
[크루스칼 알고리즘 (Kruskal's Algorithm)](/portfolio/study/kruskals-algorithm.ko/) · [최소 신장 트리 (Minimum Spanning Trees)](/portfolio/study/minimum-spanning-tree.ko/) · [다익스트라 알고리즘 (Dijkstra's Algorithm)](/portfolio/study/dijkstra.ko/)
