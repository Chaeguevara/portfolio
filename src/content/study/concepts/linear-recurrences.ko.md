---
type: concept
title: 선형 점화식 (Linear Recurrences)
lang: ko
pair: "[[linear-recurrences]]"
course: "6.042J"
lectures: [15]
summary: 상수계수 점화식은 특성방정식과 특수해를 합쳐 닫힌 꼴로 푼다.
tags: [recurrences]
prereqs: [[[induction.ko]]]
related: [[[divide-and-conquer-recurrences.ko]], [[generating-functions.ko]]]
source: [[[L15-linear-recurrences]]]
status: draft
---
# 선형 점화식 (Linear Recurrences)

*(English: [Linear Recurrences](/portfolio/study/linear-recurrences/))*

> 상수계수 점화식은 특성방정식과 특수해를 합쳐 닫힌 꼴로 푼다.

## 개념
$f(n)=c_1 f(n-1)+\dots+c_d f(n-d)$ 에서 $f(n)=r^n$ 을 대입하면 **특성방정식(characteristic
equation)** $r^d=c_1 r^{d-1}+\dots+c_d$ 가 나온다. 그 근들이 동차해를 주고, 비동차 항에는
**특수해(particular solution)** 를 더한다.

## 왜 중요한가
재귀로 정의된 수열의 닫힌 꼴을 준다 — 피보나치, 하노이 탑 횟수, 인구·금융 모델 — 반복 없이
$n$ 번째 항을 구할 수 있다.

## 세부
피보나치: 근 $\varphi=\tfrac{1+\sqrt5}{2}$ 와 $\hat\varphi$ 로
$F_n=\tfrac{\varphi^n-\hat\varphi^n}{\sqrt5}$, 따라서 $F_n=\Theta(\varphi^n)$. 중근은
$n^k r^n$ 항을 기여한다.

## 관련
[분할정복 점화식과 마스터 정리](/portfolio/study/divide-and-conquer-recurrences.ko/) · [생성함수 (Generating Functions)](/portfolio/study/generating-functions.ko/) · [수학적 귀납법 (Mathematical Induction)](/portfolio/study/induction.ko/)
