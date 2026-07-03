---
type: concept
title: 벨만–포드 알고리즘 (Bellman–Ford)
lang: ko
pair: "[[bellman-ford]]"
course: "6.006"
lectures: [12]
summary: 모든 간선을 V-1번 완화해 음수 가중치 최단 경로를 구하고, 음수 순환을 탐지한다.
tags: [graphs, shortest-paths]
prereqs: [[[weighted-shortest-paths.ko]]]
related: [[[dijkstra.ko]], [[johnsons-algorithm.ko]]]
source: [[[L12-bellman-ford]]]
status: draft
---
# 벨만–포드 알고리즘 (Bellman–Ford)

*(English: [Bellman–Ford Algorithm](/portfolio/study/bellman-ford/))*

> 모든 간선을 V-1번 완화해 음수 가중치 최단 경로를 구하고, 음수 순환을 탐지한다.

## 개념
$V-1$ 번 반복: **모든** 간선을 완화한다. 최단 경로는 간선이 많아야 $V-1$ 개라 $V-1$ 라운드면
모든 거리가 안정된다. $V$ 번째 라운드에서도 개선되면 **음수 가중치 순환** 이 드러난다.

## 왜 중요한가
범용 단일 소스 알고리즘이다: **음수 간선 가중치** 에서도 동작하며(Dijkstra 는 실패), 유한 해가
없을 때를 증명한다.

## 세부
$O(VE)$. 정당성은 귀납이다: 라운드 $k$ 후 간선 $\le k$ 개를 쓰는 모든 최단 경로가 옳다.
Johnson 의 전쌍(all-pairs) 알고리즘 안에서 재사용되는 완화 엔진이다.

## 관련
[다익스트라 알고리즘 (Dijkstra's Algorithm)](/portfolio/study/dijkstra.ko/) · [가중치 최단 경로: 개요 (Weighted Shortest Paths)](/portfolio/study/weighted-shortest-paths.ko/) · [존슨 알고리즘 (Johnson's Algorithm)](/portfolio/study/johnsons-algorithm.ko/)
