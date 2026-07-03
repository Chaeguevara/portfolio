---
type: concept
title: 존슨 알고리즘 (Johnson's Algorithm)
lang: ko
pair: "[[johnsons-algorithm]]"
course: "6.046J"
lectures: [7]
summary: "희소 그래프 전쌍 최단 경로: 벨만-포드 재가중으로 음수를 없앤 뒤 각 정점에서 Dijkstra를 돌린다."
tags: [graphs, shortest-paths]
prereqs: [[[bellman-ford.ko]], [[dijkstra.ko]]]
related: [[[floyd-warshall.ko]], [[bellman-ford.ko]], [[dijkstra.ko]]]
source: [[[L07-all-pairs-shortest-paths-ii]]]
status: draft
---
존슨 알고리즘 (Johnson's Algorithm)

*(English: [Johnson's Algorithm](/portfolio/study/johnsons-algorithm/))*

> 희소 그래프 전쌍 최단 경로: 벨만-포드 재가중으로 음수를 없앤 뒤 각 정점에서 Dijkstra를 돌린다.

## 개념
모든 정점에 0-가중치 간선으로 연결된 가상 소스를 추가하고 **벨만-포드** 로 퍼텐셜 $h(v)$ 를
얻는다. 각 간선을 $w'(u,v)=w(u,v)+h(u)-h(v)\ge 0$ 으로 재가중한다. 이제 음이 아닌 가중치에서
모든 정점에 **Dijkstra** 를 돌리고 재가중을 되돌린다.

## 왜 중요한가
음수 간선을 다루면서도 **희소** 그래프에서 Floyd-Warshall 을 이긴다 — $E\ll V^2$ 의 최선 범용
APSP.

## 세부
퍼텐셜 기법이 최단 경로를 보존하고 재가중 간선을 모두 음이 아니게 만든다. 총 시간
$O(VE + V^2\log V)$: 벨만-포드 한 번 + Dijkstra $V$ 번. 벨만-포드 단계에서 음수 순환을 탐지한다.

## 관련
[플로이드–워셜 알고리즘 (Floyd–Warshall)](/portfolio/study/floyd-warshall.ko/) · [벨만–포드 알고리즘 (Bellman–Ford)](/portfolio/study/bellman-ford.ko/) · [다익스트라 알고리즘 (Dijkstra's Algorithm)](/portfolio/study/dijkstra.ko/)
