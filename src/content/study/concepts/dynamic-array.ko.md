---
type: concept
title: 동적 배열 (Dynamic Arrays)
lang: ko
pair: "[[dynamic-array]]"
course: "6.006"
lectures: [2]
summary: 가득 차면 용량을 두 배로 늘리는 가변 배열로, O(1) 인덱싱과 분할상환 O(1) 추가를 준다.
tags: [data-structures]
prereqs: [[[word-ram-model.ko]]]
related: [[[data-structure-interfaces.ko]], [[amortized-analysis.ko]]]
source: [[[L02-data-structures-and-dynamic-arrays]]]
status: draft
---
# 동적 배열 (Dynamic Arrays)

*(English: [Dynamic Arrays](/portfolio/study/dynamic-array/))*

> 가득 차면 용량을 두 배로 늘리는 가변 배열로, O(1) 인덱싱과 분할상환 O(1) 추가를 준다.

## 개념
고정 배열은 $O(1)$ 인덱싱이지만 크기가 고정이다. **동적 배열** 은 백킹 배열을 두고, 차면
**두 배 크기** 배열을 할당해 복사한다. 추가는 보통 $O(1)$, 리사이즈 때 가끔 $O(n)$.

## 왜 중요한가
배열의 임의접근 속도와 가변 크기를 합친다 — 대부분 언어의 기본 리스트(Python `list`, C++
`vector`) — 이자 분할상환의 가장 단순한 예다.

## 세부
**분할상환 분석:** $n$ 번 추가에서 총 복사는 $1+2+4+\dots+n=O(n)$, 추가당 분할상환 비용
$O(1)$. 상수 추가가 아니라 두 배가 핵심이다; 고정량 증가는 분할상환 $\Theta(n)$ 이 된다.

## 관련
[집합 대 수열 인터페이스 (Set vs Sequence Interfaces)](/portfolio/study/data-structure-interfaces.ko/) · [분할상환 분석 (Amortized Analysis)](/portfolio/study/amortized-analysis.ko/) · [워드-RAM 모델 (Word-RAM Model)](/portfolio/study/word-ram-model.ko/)
