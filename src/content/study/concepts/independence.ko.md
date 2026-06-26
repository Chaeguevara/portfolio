---
type: concept
title: 독립성 (Independence)
lang: ko
pair: "[[independence]]"
course: "6.042J"
lectures: [20]
summary: 한 사건의 발생이 다른 사건의 확률을 바꾸지 않으면 독립이며, 상호 독립은 쌍별 독립보다 강하다.
tags: [probability]
prereqs: [[[conditional-probability-and-bayes.ko]]]
related: [[[random-variables.ko]], [[variance-and-deviation.ko]]]
source: [[[L20-independence]]]
status: draft
---
# 독립성 (Independence)

*(English: [Independence](/portfolio/study/independence/))*

> 한 사건의 발생이 다른 사건의 확률을 바꾸지 않으면 독립이며, 상호 독립은 쌍별 독립보다 강하다.

## 개념
$A,B$ 가 **독립(independent)** 인 것은 $\Pr[A\cap B]=\Pr[A]\Pr[B]$ (동치로
$\Pr[A\mid B]=\Pr[A]$)일 때다. 여러 사건의 **상호 독립(mutual)** 은 *모든* 부분집합에 대해 곱
규칙을 요구하며, **쌍별(pairwise)** 독립보다 엄밀히 강하다.

## 왜 중요한가
독립성 덕에 확률이 곱해지고 분산이 더해진다 — 이항 카운트, 오류정정 추정, 대부분의 깔끔한
분석의 가정이다.

## 세부
**생일 역설**: 23명이면 생일이 겹칠 확률이 $1/2$ 를 넘는다. 거의 독립인 쌍이 $\binom{23}{2}$
개이기 때문이다. 쌍별이지만 상호 독립이 아닌 반례가 존재한다.

## 관련
[조건부 확률과 베이즈 정리 (Conditional Probability, Bayes)](/portfolio/study/conditional-probability-and-bayes.ko/) · [확률변수와 분포 (Random Variables, Distributions)](/portfolio/study/random-variables.ko/) · [분산과 편차 한계 (Variance, Deviation Bounds)](/portfolio/study/variance-and-deviation.ko/)
