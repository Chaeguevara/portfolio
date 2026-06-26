---
type: concept
title: 관계와 부분순서 (Relations & Partial Orders)
lang: ko
pair: "[[relations-and-partial-orders]]"
course: "6.042J"
lectures: [11]
summary: 이항관계는 반사·대칭·추이성으로 분류되고, 부분순서는 의존성을 모델링해 스케줄링을 가능케 한다.
tags: [relations, order]
prereqs: []
related: [[[graphs-basics.ko]]]
source: [[[L11-relations-partial-orders-and-scheduling]]]
status: draft
---
# 관계와 부분순서 (Relations & Partial Orders)

*(English: [Relations & Partial Orders](/portfolio/study/relations-and-partial-orders/))*

> 이항관계는 반사·대칭·추이성으로 분류되고, 부분순서는 의존성을 모델링해 스케줄링을 가능케 한다.

## 개념
집합 위 관계 $R$ 은 반사·대칭·반대칭·추이적일 수 있다. **동치관계(equivalence)**
(반사+대칭+추이)는 집합을 클래스로 분할한다. **부분순서(partial order)** (반사+반대칭+추이)는
"먼저 옴 / 의존함"을 모델링한다.

## 왜 중요한가
포셋(poset)은 작업 의존성을 담는다. **위상 정렬(topological sort)** 이 이를 유효한 일정으로
선형화하고, **사슬(chain)**(완전순서 부분집합)과 **반사슬(antichain)**(서로 비교 불가)이
직렬 대 병렬 실행량을 제한한다.

## 세부
**하세 다이어그램(Hasse diagram)** 으로 그린다. 딜워스 정리: 포셋을 덮는 최소 사슬 수는 가장
큰 반사슬 크기와 같다 — 병렬 시간 대 총 작업량의 트레이드오프.

## 관련
[그래프 기초: 보행·경로·연결성](/portfolio/study/graphs-basics.ko/)
