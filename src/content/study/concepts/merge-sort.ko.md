---
type: concept
title: 병합 정렬 (Merge Sort)
lang: ko
pair: "[[merge-sort]]"
course: "6.006"
lectures: [3]
summary: 배열을 반으로 나눠 각각 재귀 정렬한 뒤 정렬된 두 절반을 선형 시간에 병합 — O(n log n).
tags: [sorting, divide-and-conquer]
prereqs: [[[comparison-sorting.ko]]]
related: [[[divide-and-conquer-recurrences.ko]], [[comparison-sorting.ko]]]
source: [[[L03-sets-and-sorting]]]
status: draft
---
# 병합 정렬 (Merge Sort)

*(English: [Merge Sort](/portfolio/study/merge-sort/))*

> 배열을 반으로 나눠 각각 재귀 정렬한 뒤 정렬된 두 절반을 선형 시간에 병합 — O(n log n).

## 개념
**분할:** 두 절반으로 나눔. **정복:** 각각 재귀 정렬. **결합:** 두 정렬 리스트를 더 작은 앞
원소를 반복해 취해 병합. $n$ 항목 병합은 $O(n)$.

## 왜 중요한가
표준 최적 비교 정렬이다: $\Theta(n\log n)$ 최악, 안정적(stable), 일반화되는 깔끔한 분할정복
틀(역위 세기, 외부 정렬).

## 세부
점화식 $T(n)=2T(n/2)+\Theta(n)$ 은 마스터 정리로 $\Theta(n\log n)$. 병합에 $O(n)$ 추가 공간
사용(제자리 힙정렬과 달리). 안정적: 같은 키의 순서 유지.

## 관련
[분할정복 점화식과 마스터 정리](/portfolio/study/divide-and-conquer-recurrences.ko/) · [비교 정렬과 그 하한 (Comparison Sorting, Lower Bound)](/portfolio/study/comparison-sorting.ko/)
