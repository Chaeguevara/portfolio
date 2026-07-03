---
type: concept
title: 클러스터링 (Clustering)
lang: ko
pair: "[[clustering]]"
course: "6.046J"
lectures: [21]
summary: 점들을 유사도로 묶는다; 탐욕·MST 기반 방법이 근사 보장을 준다.
tags: [geometry, approximation]
prereqs: [[[minimum-spanning-tree.ko]]]
related: [[[minimum-spanning-tree.ko]], [[approximation-algorithms.ko]]]
source: [[[L21-clustering]]]
status: draft
---
# 클러스터링 (Clustering)

*(English: [Clustering](/portfolio/study/clustering/))*

> 점들을 유사도로 묶는다; 탐욕·MST 기반 방법이 근사 보장을 준다.

## 개념
**클러스터링** 은 $n$ 점을 $k$ 개 군집으로 묶어 비슷한 점이 같은 군집에 들게 한다. 목적은
다양하다: **$k$-센터** 는 최대 군집 반지름을 최소화, **최대 간격(max-spacing)** 은 최소 군집간
거리를 최대화.

## 왜 중요한가
핵심 비지도 원시 연산이다 — 데이터 분석, 비전, 생물정보학 — 이자 정확한 최적이 NP-난해라 탐욕/
근사 이론을 적용하기 좋은 곳이다.

## 세부
**가장 먼 것 먼저(farthest-first)** 탐욕이 $k$-센터에 $2$-근사를 준다. **최대 간격 $k$-클러스터링
$=$ MST 에서 가장 무거운 $k-1$ 간선 제거**(단일 연결)이며 이는 정확히 최적이다 — MST 절단/순환
구조의 직접 성과.

## 관련
[최소 신장 트리 (Minimum Spanning Trees)](/portfolio/study/minimum-spanning-tree.ko/) · [근사 알고리즘 (Approximation Algorithms)](/portfolio/study/approximation-algorithms.ko/)
