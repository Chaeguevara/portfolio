---
type: concept
title: "셈하기: 합·곱 법칙과 전단사 (Counting Principles)"
lang: ko
pair: "[[counting-principles]]"
course: "6.042J"
lectures: [16]
summary: 합·곱 법칙, 순열·조합, 또는 이미 셀 수 있는 집합과의 전단사로 센다.
tags: [counting]
prereqs: []
related: [[[binomial-coefficients.ko]], [[inclusion-exclusion.ko]], [[pigeonhole-principle.ko]]]
source: [[[L16-counting-rules-i]]]
status: draft
---
셈하기: 합·곱 법칙과 전단사 (Counting Principles)

*(English: [Counting: Sum, Product & Bijections](/portfolio/study/counting-principles/))*

> 합·곱 법칙, 순열·조합, 또는 이미 셀 수 있는 집합과의 전단사로 센다.

## 개념
- **합 법칙:** 서로소인 선택은 더한다.
- **곱 법칙:** 독립적 단계는 곱한다.
- **순열:** $n!/(n-k)!$ 순서 있는 선택; **조합** $\binom nk$ 순서 없는 선택.
- **전단사 법칙:** 집합 $T$ 와 일대일 대응이 있으면 $|S|=|T|$.

## 왜 중요한가
조합론과 이산 확률의 토대다 — 표본공간 크기, 구성 가짓수, 복잡도 카운트가 모두 이 동작으로
환원된다.

## 세부
**나눗셈 법칙** 은 각 항목이 $k$ 번 중복 셈될 때 쓴다($k$ 로 나눔). 전단사 방법이 가장
우아하다: 예) $n$-집합의 부분집합 $\leftrightarrow$ 길이 $n$ 이진 문자열, $2^n$.

## 관련
[이항계수와 파스칼 삼각형 (Binomial Coefficients)](/portfolio/study/binomial-coefficients.ko/) · [포함–배제 원리 (Inclusion–Exclusion)](/portfolio/study/inclusion-exclusion.ko/) · [비둘기집 원리 (Pigeonhole Principle)](/portfolio/study/pigeonhole-principle.ko/)
