---
type: concept
title: 선형 시간 선택 (중앙값들의 중앙값)
lang: ko
pair: "[[linear-time-selection]]"
course: "6.046J"
lectures: [1]
summary: 그룹 중앙값들로 좋은 피벗을 보장해 k번째 작은 원소를 최악 O(n)에 찾는다.
tags: [divide-and-conquer, selection]
prereqs: []
related: [[[randomized-algorithms.ko]]]
source: [[[L01-introduction-median-finding]]]
status: draft
---
# 선형 시간 선택 (중앙값들의 중앙값)

*(English: [Linear-Time Selection (Median of Medians)](/portfolio/study/linear-time-selection/))*

> 그룹 중앙값들로 좋은 피벗을 보장해 k번째 작은 원소를 최악 O(n)에 찾는다.

## 개념
**선택(selection)** 은 완전 정렬 없이 $k$ 번째 작은 원소를 찾는다. 피벗 기준 분할(퀵정렬처럼)
후 순위 $k$ 가 있는 쪽으로 재귀한다. 핵심은 항상 일정 비율을 버리는 피벗이다.

## 왜 중요한가
중앙값·순위 통계 찾기에서 정렬($\Theta(n\log n)$)을 이기고, 신중한 피벗 선택이 무작위 기댓값을
최악 보장으로 바꾸는 법을 보여준다.

## 세부
**중앙값들의 중앙값:** 5개 그룹으로 나눠 각 중앙값을 취하고, 그 중앙값들의 중앙값을 재귀
선택. 원소의 $\ge 3/10$ 이 버려짐을 보장해 $T(n)=T(n/5)+T(7n/10)+O(n)=O(n)$. 무작위
퀵셀렉트는 기대 $O(n)$ 이며 더 단순하다.

## 관련
[무작위 알고리즘 (Randomized Algorithms)](/portfolio/study/randomized-algorithms.ko/)
