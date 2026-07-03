---
type: concept
title: 크루스칼 알고리즘 (Kruskal's Algorithm)
lang: ko
pair: "[[kruskals-algorithm]]"
course: "6.046J"
lectures: [4]
summary: 모든 간선을 정렬하고 서로 다른 성분을 잇는 가장 가벼운 간선을 union-find로 추가한다.
tags: [graphs, greedy]
prereqs: [[[minimum-spanning-tree.ko]], [[union-find.ko]]]
related: [[[prims-algorithm.ko]], [[union-find.ko]]]
source: [[[L04-minimum-spanning-trees-ii]]]
status: draft
---
# 크루스칼 알고리즘 (Kruskal's Algorithm)

*(English: [Kruskal's Algorithm](/portfolio/study/kruskals-algorithm/))*

> 모든 간선을 정렬하고 서로 다른 성분을 잇는 가장 가벼운 간선을 union-find로 추가한다.

## 개념
간선을 가중치 오름차순 정렬. 훑으면서 끝점이 서로 다른 성분에 있을 때 **그리고 그때만**(순환이
안 생김) 간선을 추가하고 두 성분을 병합한다. 간선 $V-1$ 개에서 멈춘다.

## 왜 중요한가
희소 그래프에 빛나는 깔끔한 탐욕 MST 이자 **union-find** 자료구조의 표준 응용이다.

## 세부
순환 검사 = "이 두 정점이 이미 연결됐나?"를 union-find 의 `find` 로 답하고, 병합은 `union`.
비용: 정렬 $O(E\log E)$ 가 지배하며 union-find 작업은 거의 선형. 정당성은 다시 절단 성질.

## 관련
[프림 알고리즘 (Prim's Algorithm)](/portfolio/study/prims-algorithm.ko/) · [유니온-파인드 (서로소 집합) (Union-Find)](/portfolio/study/union-find.ko/) · [최소 신장 트리 (Minimum Spanning Trees)](/portfolio/study/minimum-spanning-tree.ko/)
