---
type: concept
title: DAG 최단 경로 (완화) (DAG Relaxation)
lang: ko
pair: "[[dag-relaxation]]"
course: "6.006"
lectures: [11]
summary: DAG에서 간선을 위상 순서로 완화하면 음수 가중치가 있어도 O(V+E)에 최단 경로를 구한다.
tags: [graphs, shortest-paths]
prereqs: [[[topological-sort.ko]]]
related: [[[weighted-shortest-paths.ko]], [[dynamic-programming.ko]]]
source: [[[L11-weighted-shortest-paths]]]
status: draft
---
# DAG 최단 경로 (완화) (DAG Relaxation)

*(English: [DAG Shortest Paths (Relaxation)](/portfolio/study/dag-relaxation/))*

> DAG에서 간선을 위상 순서로 완화하면 음수 가중치가 있어도 O(V+E)에 최단 경로를 구한다.

## 개념
DAG 를 위상 정렬한 뒤 그 순서로 정점을 처리하며 나가는 간선을 모두 완화한다. 정점을 처리하기
전에 모든 선행자가 확정되므로 한 번의 패스로 충분하다.

## 왜 중요한가
가장 빠른 최단 경로 알고리즘 — 선형 시간 — 이자 **동적 계획법** 의 구조적 틀이다: 부분문제가
DAG 를 이루고 DP 는 이를 위상 순서로 완화한다.

## 세부
**음수 간선 가중치** 를 추가 비용 없이 처리한다(DAG 엔 음수 순환이 없음). DP 관점:
$d[v]=\min_{u\to v}\big(d[u]+w(u,v)\big)$ 를 위상 순서로 평가.

## 관련
[가중치 최단 경로: 개요 (Weighted Shortest Paths)](/portfolio/study/weighted-shortest-paths.ko/) · [위상 정렬 (Topological Sort)](/portfolio/study/topological-sort.ko/) · [동적 계획법 (SRTBOT) (Dynamic Programming)](/portfolio/study/dynamic-programming.ko/)
