---
type: concept
title: 강한 귀납법 (Strong Induction)
lang: ko
pair: "[[strong-induction]]"
course: "6.042J"
lectures: [3]
summary: 귀납 단계에서 P(n)뿐 아니라 n 이하 모든 값에 대해 P가 성립함을 가정할 수 있는 귀납법.
tags: [proofs, induction]
prereqs: [[[induction.ko]]]
related: [[[well-ordering-principle.ko]], [[divide-and-conquer-recurrences.ko]]]
source: [[[L03-strong-induction]]]
status: draft
---
# 강한 귀납법 (Strong Induction)

*(English: [Strong Induction](/portfolio/study/strong-induction/))*

> 귀납 단계에서 P(n)뿐 아니라 n 이하 모든 값에 대해 P가 성립함을 가정할 수 있는 귀납법.

## 개념
$P(n)$ 을 증명할 때 $P(0),P(1),\dots,P(n-1)$ 이 모두 성립한다고 가정하고 $P(n)$ 을 끌어낸다.
보통 귀납법과 논리적으로 동치지만, 더 강한 가정이 필요할 때가 많다.

## 왜 중요한가
$n$ 이 *크기가 제각각인 더 작은 조각들* 로 쪼개질 때 딱 맞다 — 예: 1 보다 큰 모든 정수는
소인수분해를 가진다($n=ab$ 로 쪼개 $a,b<n$ 에 가정 적용).

## 세부
8 센트 이상 우편요금은 3·5 센트 우표로 지불 가능함을 보일 때, 또 부분문제 크기가 $n/2$
이하인 분할정복 점화식을 정당화할 때 쓴다.

## 관련
[수학적 귀납법 (Mathematical Induction)](/portfolio/study/induction.ko/) · [정렬 원리 (Well-Ordering Principle)](/portfolio/study/well-ordering-principle.ko/) · [분할정복 점화식과 마스터 정리](/portfolio/study/divide-and-conquer-recurrences.ko/)
