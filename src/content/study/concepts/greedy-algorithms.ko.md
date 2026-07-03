---
type: concept
title: 탐욕 알고리즘과 교환 논증 (Greedy, Exchange Argument)
lang: ko
pair: "[[greedy-algorithms]]"
course: "6.046J"
lectures: [2]
summary: 국소 최적 선택으로 해를 만들고, 교환 논증이나 매트로이드 구조로 최적성을 증명한다.
tags: [greedy]
prereqs: []
related: [[[interval-scheduling.ko]], [[minimum-spanning-tree.ko]], [[huffman-coding.ko]]]
source: [[[L02-recap-interval-scheduling]]]
status: draft
---
# 탐욕 알고리즘과 교환 논증 (Greedy, Exchange Argument)

*(English: [Greedy Algorithms & the Exchange Argument](/portfolio/study/greedy-algorithms/))*

> 국소 최적 선택으로 해를 만들고, 교환 논증이나 매트로이드 구조로 최적성을 증명한다.

## 개념
**탐욕(greedy)** 알고리즘은 지금 가장 좋아 보이는 선택을 하고 되돌아보지 않는다. 국소 최적이
전역 최적을 함의할 때만 동작하며, 이는 가정이 아니라 **증명** 해야 한다.

## 왜 중요한가
유효할 때 탐욕은 가장 단순하고 빠른 설계다. 어려운 부분은 정당성 증명이며, 탐욕이 실패하는
(그래서 DP 가 필요한) 때를 알아보는 것이 핵심 기술이다.

## 세부
표준 증명은 **교환 논증(exchange argument):** 임의의 최적해를 두고 그 선택 하나를 탐욕 선택으로
바꿔도 나빠지지 않게 하며, 탐욕해와 같아질 때까지 반복한다. 매트로이드 틀이 탐욕이 최적인
조건을 정확히 특징짓는다.

## 관련
[구간 스케줄링 (Interval Scheduling)](/portfolio/study/interval-scheduling.ko/) · [최소 신장 트리 (Minimum Spanning Trees)](/portfolio/study/minimum-spanning-tree.ko/) · [허프만 코딩 (Huffman Coding)](/portfolio/study/huffman-coding.ko/)
