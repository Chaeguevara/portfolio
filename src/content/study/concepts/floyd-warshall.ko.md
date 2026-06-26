---
type: concept
title: 플로이드–워셜 알고리즘 (Floyd–Warshall)
lang: ko
pair: "[[floyd-warshall]]"
course: "6.046J"
lectures: [7]
summary: 중간 정점을 하나씩 허용하는 DP로 O(V^3)에 전쌍 최단 경로를 구한다.
tags: [graphs, shortest-paths, dynamic-programming]
prereqs: [[[apsp-dynamic-programming.ko]]]
related: [[[johnsons-algorithm.ko]]]
source: [[[L07-all-pairs-shortest-paths-ii]]]
status: draft
---
# 플로이드–워셜 알고리즘 (Floyd–Warshall)

*(English: [Floyd–Warshall Algorithm](/portfolio/study/floyd-warshall/))*

> 중간 정점을 하나씩 허용하는 DP로 O(V^3)에 전쌍 최단 경로를 구한다.

## 개념
정점에 번호를 매긴다. $d^{(k)}_{ij}$ 를 중간 정점으로 $\{1,\dots,k\}$ 만 쓰는 최단 $i\to j$
경로라 하면
$d^{(k)}_{ij}=\min\big(d^{(k-1)}_{ij},\;d^{(k-1)}_{ik}+d^{(k-1)}_{kj}\big)$ — $k$ 를 건너뛰거나
경유한다.

## 왜 중요한가
지극히 단순한 삼중 루프로 **음수 간선**(음수 순환 없음)을 다루며 모든 쌍 거리를 세제곱 시간에
준다 — 밀집 그래프의 정석.

## 세부
$k,i,j$ 에 대한 삼중 루프, 제자리 갱신 가능, 시간 $O(V^3)$ 공간 $O(V^2)$. 선행자 행렬을 저장해
경로를 복원한다. 대각 성분이 음수면 음수 순환을 뜻한다.

## 관련
[동적 계획법 기반 전쌍 최단 경로 (APSP via DP)](/portfolio/study/apsp-dynamic-programming.ko/) · [존슨 알고리즘 (Johnson's Algorithm)](/portfolio/study/johnsons-algorithm.ko/)
