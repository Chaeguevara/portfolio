---
type: concept
title: 동적 계획법 기반 전쌍 최단 경로 (APSP via DP)
lang: ko
pair: "[[apsp-dynamic-programming]]"
course: "6.046J"
lectures: [6]
summary: 경로 길이에 대한 DP로 모든 쌍의 최단 경로를 구한다 — 반복 행렬곱과 같은 구조.
tags: [graphs, shortest-paths, dynamic-programming]
prereqs: [[[bellman-ford.ko]]]
related: [[[floyd-warshall.ko]], [[johnsons-algorithm.ko]]]
source: [[[L06-all-pairs-shortest-paths-i]]]
status: draft
---
# 동적 계획법 기반 전쌍 최단 경로 (APSP via DP)

*(English: [All-Pairs Shortest Paths via DP](/portfolio/study/apsp-dynamic-programming/))*

> 경로 길이에 대한 DP로 모든 쌍의 최단 경로를 구한다 — 반복 행렬곱과 같은 구조.

## 개념
$d^{(m)}_{ij}$ 를 간선 $\le m$ 개를 쓰는 최단 $i\to j$ 경로라 하자. 점화식
$d^{(m)}_{ij}=\min_k\big(d^{(m-1)}_{ik}+w_{kj}\big)$ 는 $(+,\times)$ 대신 $(\min,+)$ 를 쓴
행렬곱과 같다.

## 왜 중요한가
APSP 를 깔끔한 DP/대수 구조로 보고 더 빠른 전용 알고리즘을 동기화한다. 한 소스가 아니라 **모든**
쌍 사이 거리가 필요할 때 유용하다.

## 세부
순진하게 $O(V^4)$; $(\min,+)$ 행렬의 **반복 제곱** 으로 $O(V^3\log V)$. 둘 다
Floyd-Warshall($O(V^3)$)과 희소 그래프의 Johnson 에게 밀린다.

## 관련
[플로이드–워셜 알고리즘 (Floyd–Warshall)](/portfolio/study/floyd-warshall.ko/) · [존슨 알고리즘 (Johnson's Algorithm)](/portfolio/study/johnsons-algorithm.ko/) · [벨만–포드 알고리즘 (Bellman–Ford)](/portfolio/study/bellman-ford.ko/)
