---
type: concept
title: 유니온-파인드 (서로소 집합) (Union-Find)
lang: ko
pair: "[[union-find]]"
course: "6.046J"
lectures: [4, 16]
summary: 랭크 기반 합치기와 경로 압축으로 거의 상수 시간의 find/union을 지원하는 서로소 집합 구조.
tags: [data-structures]
prereqs: []
related: [[[kruskals-algorithm.ko]], [[amortized-analysis.ko]]]
source: [[[L04-minimum-spanning-trees-ii]], [[L16-disjoint-set-data-structures]]]
status: draft
---
# 유니온-파인드 (서로소 집합) (Union-Find)

*(English: [Union-Find (Disjoint Sets)](/portfolio/study/union-find/))*

> 랭크 기반 합치기와 경로 압축으로 거의 상수 시간의 find/union을 지원하는 서로소 집합 구조.

## 개념
`make-set`, `find`($x$ 가 어느 집합?), `union`(두 집합 병합)을 지원한다. 각 집합을 부모 포인터
트리로 표현하고 `find` 는 루트를 반환한다. 두 최적화가 트리를 평평하게 유지한다.

## 왜 중요한가
Kruskal MST, 연결성 질의, 점진 클러스터링의 골격이자 작은 개선이 거의 선형 분할상환 한계를 주는
대표 예다.

## 세부
**랭크 기반 합치기(union by rank):** 낮은 트리를 높은 트리 밑에 붙임. **경로 압축(path
compression):** `find` 가 방문한 모든 노드를 루트에 직접 연결. 둘이 합쳐 $m$ 연산이
$O(m\,\alpha(n))$ 이며, $\alpha$(역 애커만)는 모든 실용 $n$ 에서 $\le 4$.

## 관련
[크루스칼 알고리즘 (Kruskal's Algorithm)](/portfolio/study/kruskals-algorithm.ko/) · [분할상환 분석 (Amortized Analysis)](/portfolio/study/amortized-analysis.ko/)
