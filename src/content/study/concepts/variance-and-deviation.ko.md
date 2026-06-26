---
type: concept
title: 분산과 편차 한계 (Variance, Deviation Bounds)
lang: ko
pair: "[[variance-and-deviation]]"
course: "6.042J"
lectures: [24]
summary: 분산은 퍼짐을 재고, 마르코프·체비쇼프 부등식이 평균에서 크게 벗어날 확률을 제한한다.
tags: [probability]
prereqs: [[[expectation.ko]]]
related: [[[expectation.ko]], [[random-walks.ko]], [[independence.ko]]]
source: [[[L24-large-deviations]]]
status: draft
---
# 분산과 편차 한계 (Variance, Deviation Bounds)

*(English: [Variance & Deviation Bounds](/portfolio/study/variance-and-deviation/))*

> 분산은 퍼짐을 재고, 마르코프·체비쇼프 부등식이 평균에서 크게 벗어날 확률을 제한한다.

## 개념
$\mathrm{Var}[X]=E[(X-E[X])^2]=E[X^2]-E[X]^2$; 표준편차는 그 제곱근. **마르코프:** $X\ge 0$ 이면
$\Pr[X\ge a]\le E[X]/a$. **체비쇼프:** $\Pr[\,|X-E[X]|\ge a\,]\le \mathrm{Var}[X]/a^2$.

## 왜 중요한가
기댓값만으로는 결과의 신뢰도를 알 수 없다. 편차 한계가 "평균이 작다"를 "거의 항상 작다"로
바꾼다 — 집중(concentration)과 약한 큰 수의 법칙의 토대다.

## 세부
독립 변수에 대해 **분산이 더해진다**. $n$ 개 i.i.d. 항을 합하면 상대 퍼짐이 $1/\sqrt n$ 처럼
줄어 평균이 집중한다. 더 알면 더 날카로운 지수 한계(체르노프)가 따라온다.

## 관련
[기댓값과 선형성 (Expectation, Linearity)](/portfolio/study/expectation.ko/) · [랜덤 워크와 도박꾼의 파산 (Random Walks, Gambler's Ruin)](/portfolio/study/random-walks.ko/) · [독립성 (Independence)](/portfolio/study/independence.ko/)
