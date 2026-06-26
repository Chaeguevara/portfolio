---
type: concept
title: "그래프 기초: 보행·경로·연결성"
lang: ko
pair: "[[graphs-basics]]"
course: "6.042J"
lectures: [6]
summary: 그래프는 간선으로 이어진 정점들이며, 보행·경로·순환·연결성으로 그 안의 이동을 기술한다.
tags: [graph-theory]
prereqs: []
related: [[[graph-coloring.ko]], [[trees-and-spanning-trees.ko]], [[bipartite-matching.ko]]]
source: [[[L06-graph-theory-and-coloring]]]
status: draft
---
그래프 기초: 보행·경로·연결성

*(English: [Graphs: Walks, Paths & Connectivity](/portfolio/study/graphs-basics/))*

> 그래프는 간선으로 이어진 정점들이며, 보행·경로·순환·연결성으로 그 안의 이동을 기술한다.

## 개념
$G=(V,E)$. **보행(walk)** 은 인접 정점들의 나열, **경로(path)** 는 정점을 반복하지 않는 보행,
**순환(cycle)** 은 닫힌 경로다. 모든 쌍을 경로로 이으면 **연결(connected)**. 정점의
**차수(degree)** 는 간선 수이며 $\sum_v \deg(v)=2|E|$ (악수 보조정리).

## 왜 중요한가
네트워크·의존성·지도·회로의 공통 어휘다 — 이후 모든 그래프 결과(색칠, 매칭, 트리, 평면성)가
여기에 쌓인다.

## 세부
연결 성분이 $V$ 를 분할한다. 오일러 보행은 모든 간선을 한 번씩 쓰고(홀수차수 정점 $\le 2$ 일
때 존재), 해밀턴 경로는 모든 정점을 한 번씩 방문한다(일반적으로 어려움).

## 관련
[그래프 색칠 (Graph Coloring)](/portfolio/study/graph-coloring.ko/) · [트리와 신장 트리 (Trees & Spanning Trees)](/portfolio/study/trees-and-spanning-trees.ko/) · [이분 매칭과 홀의 정리 (Bipartite Matching, Hall's Theorem)](/portfolio/study/bipartite-matching.ko/)
