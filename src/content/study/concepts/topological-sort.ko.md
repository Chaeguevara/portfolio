---
type: concept
title: 위상 정렬 (Topological Sort)
lang: ko
pair: "[[topological-sort]]"
course: "6.006"
lectures: [10]
summary: DAG를 모든 간선이 앞을 향하도록 선형 배열한다; DAG 동적 계획법의 전제 조건.
tags: [graphs]
prereqs: [[[depth-first-search.ko]]]
related: [[[dag-relaxation.ko]], [[relations-and-partial-orders.ko]]]
source: [[[L10-depth-first-search]]]
status: draft
---
# 위상 정렬 (Topological Sort)

*(English: [Topological Sort](/portfolio/study/topological-sort/))*

> DAG를 모든 간선이 앞을 향하도록 선형 배열한다; DAG 동적 계획법의 전제 조건.

## 개념
**방향 비순환 그래프(DAG)** 에서 위상 순서는 모든 간선 $u\to v$ 에 대해 $u$ 가 $v$ 보다 앞에
오도록 정점을 나열한다. DFS(종료 시간 역순)나 소스를 반복 제거(칸 알고리즘)로 $O(V+E)$ 에
구한다.

## 왜 중요한가
의존성 있는 모든 과정 — 선수과목, 빌드 시스템, 작업 스케줄링 — 은 유효한 순서가 필요하다.
또 동적 계획법을 잘 정의되게 만드는 "위상 순서" 단계다.

## 세부
위상 순서는 그래프가 비순환일 때 **그리고 그때만** 존재한다(순환엔 유효 순서 없음). 유일하지
않을 수 있다. DAG 최단 경로와 DP 모두 이 순서로 부분문제를 완화한다.

## 관련
[DAG 최단 경로 (완화) (DAG Relaxation)](/portfolio/study/dag-relaxation.ko/) · [깊이 우선 탐색 (DFS)](/portfolio/study/depth-first-search.ko/) · [관계와 부분순서 (Relations & Partial Orders)](/portfolio/study/relations-and-partial-orders.ko/)
