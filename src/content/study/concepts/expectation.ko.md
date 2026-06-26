---
type: concept
title: 기댓값과 선형성 (Expectation, Linearity)
lang: ko
pair: "[[expectation]]"
course: "6.042J"
lectures: [22, 23]
summary: 기댓값은 확률 가중 평균이며, 종속 변수에 대해서도 기댓값은 선형이다.
tags: [probability]
prereqs: [[[random-variables.ko]]]
related: [[[variance-and-deviation.ko]], [[random-variables.ko]]]
source: [[[L22-expectation-i]], [[L23-expectation-ii]]]
status: draft
---
# 기댓값과 선형성 (Expectation, Linearity)

*(English: [Expectation & Linearity](/portfolio/study/expectation/))*

> 기댓값은 확률 가중 평균이며, 종속 변수에 대해서도 기댓값은 선형이다.

## 개념
$E[X]=\sum_k k\,\Pr[X=k]$ (또는 $\sum_\omega X(\omega)\Pr[\omega]$). 핵심 도구는
**선형성(linearity):** $E[X+Y]=E[X]+E[Y]$ — $X,Y$ 가 종속이어도 *항상* 성립. 독립이면
$E[XY]=E[X]E[Y]$ 도 성립.

## 왜 중요한가
선형성 덕에 복잡한 셈을 지시변수(indicator)로 분해해 쉬운 기댓값을 합할 수 있다 — 확률적
분석에서 가장 유용한 한 가지 기술이다.

## 세부
**지시변수 방법:** $E[\#\text{사건}]$ 을 $\sum_i \mathbf 1_i$ 로 써서
$E=\sum_i\Pr[\text{사건 }i]$. 기대 고정점($=1$), 쿠폰 수집가 시간 $\Theta(n\log n)$,
무작위 퀵정렬의 기대 실행시간을 준다.

## 관련
[분산과 편차 한계 (Variance, Deviation Bounds)](/portfolio/study/variance-and-deviation.ko/) · [확률변수와 분포 (Random Variables, Distributions)](/portfolio/study/random-variables.ko/)
