---
type: concept
title: 이항계수와 파스칼 삼각형 (Binomial Coefficients)
lang: ko
pair: "[[binomial-coefficients]]"
course: "6.042J"
lectures: [16]
summary: C(n,k)는 k-부분집합을 세며, 이항정리와 파스칼 항등식이 이를 정리한다.
tags: [counting]
prereqs: [[[counting-principles.ko]]]
related: [[[counting-principles.ko]], [[generating-functions.ko]]]
source: [[[L16-counting-rules-i]]]
status: draft
---
# 이항계수와 파스칼 삼각형 (Binomial Coefficients)

*(English: [Binomial Coefficients & Pascal's Triangle](/portfolio/study/binomial-coefficients/))*

> C(n,k)는 k-부분집합을 세며, 이항정리와 파스칼 항등식이 이를 정리한다.

## 개념
$\binom nk=\tfrac{n!}{k!(n-k)!}$ 은 $n$ 개에서 $k$ 개를 고르는 가짓수다. **파스칼 항등식:**
$\binom nk=\binom{n-1}{k-1}+\binom{n-1}{k}$ (특정 항목 포함/제외). **이항정리:**
$(x+y)^n=\sum_k\binom nk x^k y^{n-k}$.

## 왜 중요한가
CS 에서 가장 흔한 셈 — 부분집합, 격자 경로, 전개 계수 — 이자 조합적 증명과 생성함수의
출발점이다.

## 세부
대칭 $\binom nk=\binom n{n-k}$; 행 합 $\sum_k\binom nk=2^n$ (모든 부분집합). **조합적
증명(combinatorial proof)** 은 한 집합을 두 방식으로 세서 항등식을 세운다(대수 대신).

## 관련
[셈하기: 합·곱 법칙과 전단사 (Counting Principles)](/portfolio/study/counting-principles.ko/) · [생성함수 (Generating Functions)](/portfolio/study/generating-functions.ko/)
