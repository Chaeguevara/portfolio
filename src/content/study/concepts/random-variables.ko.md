---
type: concept
title: 확률변수와 분포 (Random Variables, Distributions)
lang: ko
pair: "[[random-variables]]"
course: "6.042J"
lectures: [21]
summary: 확률변수는 결과를 수로 보내고, 그 분포(PMF)는 각 값의 확률을 나열한다.
tags: [probability]
prereqs: [[[probability-basics.ko]]]
related: [[[expectation.ko]], [[variance-and-deviation.ko]], [[independence.ko]]]
source: [[[L21-random-variables]]]
status: draft
---
# 확률변수와 분포 (Random Variables, Distributions)

*(English: [Random Variables & Distributions](/portfolio/study/random-variables/))*

> 확률변수는 결과를 수로 보내고, 그 분포(PMF)는 각 값의 확률을 나열한다.

## 개념
**확률변수(random variable)** $X:\Omega\to\mathbb{R}$ 는 각 결과에 수를 배정한다.
**확률질량함수(PMF)** 는 $p_X(k)=\Pr[X=k]$, **CDF** 는 $\Pr[X\le k]$. 결합 PMF 가 곱으로
분해되면 확률변수들이 **독립** 이다.

## 왜 중요한가
무작위 과정 — 횟수·시간·비용 — 을 정량적으로 다루게 해주며, 기댓값과 분산이 요약하는
대상이다.

## 세부
표준 분포: **베르누이**(한 번 시행), **이항** $\binom nk p^k(1-p)^{n-k}$ ($n$ 번 베르누이의
합), **균등**, **기하**(첫 성공까지 시행). 이항분포는 독립 시행의 성공 횟수에 대한 표준
카운트다.

## 관련
[기댓값과 선형성 (Expectation, Linearity)](/portfolio/study/expectation.ko/) · [분산과 편차 한계 (Variance, Deviation Bounds)](/portfolio/study/variance-and-deviation.ko/) · [독립성 (Independence)](/portfolio/study/independence.ko/)
