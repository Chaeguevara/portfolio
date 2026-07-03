---
type: concept
title: 정렬 원리 (Well-Ordering Principle)
lang: ko
pair: "[[well-ordering-principle]]"
course: "6.042J"
lectures: [3]
summary: 공집합이 아닌 음이 아닌 정수 집합은 항상 최소 원소를 가진다 — 귀납법과 동치인 증명 도구.
tags: [proofs]
prereqs: [[[induction.ko]]]
related: [[[strong-induction.ko]], [[divisibility-and-gcd.ko]]]
source: [[[L03-strong-induction]]]
status: draft
---
# 정렬 원리 (Well-Ordering Principle)

*(English: [Well-Ordering Principle](/portfolio/study/well-ordering-principle/))*

> 공집합이 아닌 음이 아닌 정수 집합은 항상 최소 원소를 가진다 — 귀납법과 동치인 증명 도구.

## 개념
$S\subseteq\mathbb{N}$ 이고 $S\ne\emptyset$ 이면 $S$ 에는 최소 원소가 있다. 쓰는 법: 반례가
있다고 가정하고 모든 반례를 $S$ 에 모은 뒤 **최소** 반례를 택해 모순(보통 더 작은 반례를
만들어냄)을 끌어낸다.

## 왜 중요한가
"가장 작은 나쁜 경우가 없다" 류 논증에서 귀납법보다 깔끔할 때가 많고, 유클리드 알고리즘의
정당성과 소인수분해의 존재성을 떠받친다.

## 세부
예: 모든 $n>1$ 이 소인수를 가짐을 증명. 아니라면 그런 $n$ 들의 집합에 최소 원소 $m$ 이
있고, $m$ 은 소수가 아니므로 $m=ab$ ($1<a<m$), $a$ 는 소인수를 가지며 그것은 $m$ 도 나눈다.
모순.

## 관련
[수학적 귀납법 (Mathematical Induction)](/portfolio/study/induction.ko/) · [강한 귀납법 (Strong Induction)](/portfolio/study/strong-induction.ko/) · [나누어떨어짐·최대공약수·유클리드 호제법](/portfolio/study/divisibility-and-gcd.ko/)
