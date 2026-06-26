---
type: concept
title: 그래프 색칠 (Graph Coloring)
lang: ko
pair: "[[graph-coloring]]"
course: "6.042J"
lectures: [6, 10]
summary: 인접한 정점이 다른 색이 되도록 색을 배정하며, 필요한 최소 색 수가 채색수다.
tags: [graph-theory]
prereqs: [[[graphs-basics.ko]]]
related: [[[planar-graphs.ko]], [[bipartite-matching.ko]]]
source: [[[L06-graph-theory-and-coloring]], [[L10-graph-theory-iii]]]
status: draft
---
# 그래프 색칠 (Graph Coloring)

*(English: [Graph Coloring](/portfolio/study/graph-coloring/))*

> 인접한 정점이 다른 색이 되도록 색을 배정하며, 필요한 최소 색 수가 채색수다.

## 개념
**적절한 색칠(proper coloring)** 은 인접 정점에 다른 색을 준다. **채색수(chromatic number)**
$\chi(G)$ 는 가능한 최소 색 수다. $\chi(G)=2$ 는 $G$ 가 **이분(bipartite)**(홀수 순환 없음)일
때와 동치.

## 왜 중요한가
충돌 없는 스케줄링을 모델링한다: 시험·레지스터·주파수 — 충돌하는 항목은 다른 "색"(시간대,
레지스터, 채널)을 받는다.

## 세부
탐욕 색칠은 $\le \Delta+1$ 색을 쓴다($\Delta$ = 최대 차수). 평면 그래프는 $\le 4$ 색이면
된다(4색 정리); 5색 한계는 오일러 공식으로 초등적으로 증명된다.

## 관련
[평면 그래프와 오일러 공식 (Planar Graphs, Euler's Formula)](/portfolio/study/planar-graphs.ko/) · [이분 매칭과 홀의 정리 (Bipartite Matching, Hall's Theorem)](/portfolio/study/bipartite-matching.ko/) · [그래프 기초: 보행·경로·연결성](/portfolio/study/graphs-basics.ko/)
