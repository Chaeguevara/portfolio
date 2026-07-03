---
type: concept
title: "확률 기초: 표본공간과 4단계 방법"
lang: ko
pair: "[[probability-basics]]"
course: "6.042J"
lectures: [18]
summary: 실험을 표본공간과 결과 위 확률로 모델링하고, 4단계 방법으로 체계화한다.
tags: [probability]
prereqs: [[[counting-principles.ko]]]
related: [[[conditional-probability-and-bayes.ko]], [[independence.ko]], [[random-variables.ko]]]
source: [[[L18-probability-introduction]]]
status: draft
---
확률 기초: 표본공간과 4단계 방법

*(English: [Probability: Sample Spaces & the Four-Step Method](/portfolio/study/probability-basics/))*

> 실험을 표본공간과 결과 위 확률로 모델링하고, 4단계 방법으로 체계화한다.

## 개념
**표본공간(sample space)** $\Omega$ 는 모든 결과를 나열하고, **사건(event)** 은 부분집합,
확률은 합이 $1$ 인 $\Pr[\omega]\ge 0$ 을 배정하며 $\Pr[E]=\sum_{\omega\in E}\Pr[\omega]$.
**4단계 방법:** (1) 표본공간 찾기, (2) 사건 정의, (3) 결과 확률 배정, (4) 사건 확률 계산.

## 왜 중요한가
규율 있는 설정이 고전적 실수를 막는다. 몬티 홀과 생일 문제는 표본공간을 적어내기 전까지만
역설처럼 보인다.

## 세부
동등 확률 결과면 $\Pr[E]=|E|/|\Omega|$ — 확률이 셈으로 환원된다. 트리 다이어그램이 다단계
실험과 결과 확률을 정리한다.

## 관련
[조건부 확률과 베이즈 정리 (Conditional Probability, Bayes)](/portfolio/study/conditional-probability-and-bayes.ko/) · [독립성 (Independence)](/portfolio/study/independence.ko/) · [확률변수와 분포 (Random Variables, Distributions)](/portfolio/study/random-variables.ko/)
