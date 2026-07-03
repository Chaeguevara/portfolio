---
type: concept
title: 비무작위화 (Derandomization)
lang: ko
pair: "[[derandomization]]"
course: "6.046J"
lectures: [22]
summary: "무작위 알고리즘을 결정적 알고리즘으로 바꾼다 — 예: 조건부 기댓값 방법."
tags: [randomization]
prereqs: [[[randomized-algorithms.ko]]]
related: [[[randomized-algorithms.ko]], [[approximation-algorithms.ko]]]
source: [[[L22-derandomization]]]
status: draft
---
비무작위화 (Derandomization)

*(English: [Derandomization](/portfolio/study/derandomization/))*

> 무작위 알고리즘을 결정적 알고리즘으로 바꾼다 — 예: 조건부 기댓값 방법.

## 개념
무작위 알고리즘이 기댓값 $E$ 를 달성하면 *어떤* 고정 선택은 그만큼은 한다. **조건부 기댓값
방법** 은 무작위 비트를 하나씩 고정하며, 매번 조건부 기댓값을 좋은 쪽으로 유지하는 값을 택한다.

## 왜 중요한가
무작위 분석에서 결정적 보장을 끌어낸다 — 무작위성이 비싸거나 없을 때 중요하며, 결정적 근사
알고리즘을 얻는 표준 방법이다.

## 세부
예: MAX-CUT — 무작위 절단은 기대상 간선의 $\ge E/2$ 를 유지; 그 기댓값을 유지하도록 각 정점의
쪽을 탐욕 결정하면 결정적 $\tfrac12$-근사가 된다. **쌍별 독립** 과 작은 표본공간도 비무작위화
경로다.

## 관련
[무작위 알고리즘 (Randomized Algorithms)](/portfolio/study/randomized-algorithms.ko/) · [근사 알고리즘 (Approximation Algorithms)](/portfolio/study/approximation-algorithms.ko/)
