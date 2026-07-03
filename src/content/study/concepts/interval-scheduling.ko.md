---
type: concept
title: 구간 스케줄링 (Interval Scheduling)
lang: ko
pair: "[[interval-scheduling]]"
course: "6.046J"
lectures: [2]
summary: 가장 일찍 끝나는 구간을 반복해 골라 겹치지 않는 구간을 최대로 선택한다.
tags: [greedy]
prereqs: [[[greedy-algorithms.ko]]]
related: [[[greedy-algorithms.ko]]]
source: [[[L02-recap-interval-scheduling]]]
status: draft
---
# 구간 스케줄링 (Interval Scheduling)

*(English: [Interval Scheduling](/portfolio/study/interval-scheduling/))*

> 가장 일찍 끝나는 구간을 반복해 골라 겹치지 않는 구간을 최대로 선택한다.

## 개념
시작/종료 시각이 있는 구간들에서 서로 겹치지 않는 최대 집합을 고른다. 탐욕 규칙: 호환되는
것들 중 **가장 일찍 끝나는** 구간을 항상 택하고, 그와 겹치는 것을 모두 버린다.

## 왜 중요한가
올바른 탐욕 알고리즘의 교과서 예다 — 회의실·CPU·일정 — 이자 교환 논증 증명의 깔끔한 대상이다.

## 세부
종료 시각으로 정렬($O(n\log n)$) 후 한 번의 선형 패스. 교환 논증: 가장 일찍 끝나는 것이 가장
많은 여유를 남기므로 어떤 최적해가 이를 포함하고, 나머지에 귀납한다. 가장 이른 시작·가장 짧은
구간 규칙은 모두 실패한다.

## 관련
[탐욕 알고리즘과 교환 논증 (Greedy, Exchange Argument)](/portfolio/study/greedy-algorithms.ko/)
