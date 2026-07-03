---
type: concept
title: 합과 합산 기법 (Sums & Summation Techniques)
lang: ko
pair: "[[sums-and-techniques]]"
course: "6.042J"
lectures: [12]
summary: 유한 합을 등차·등비 공식, 섭동, 망원 기법으로 계산하고 한계를 잡는다.
tags: [sums]
prereqs: []
related: [[[asymptotics-and-integral-bounds.ko]], [[generating-functions.ko]]]
source: [[[L12-sums]]]
status: draft
---
# 합과 합산 기법 (Sums & Summation Techniques)

*(English: [Sums & Summation Techniques](/portfolio/study/sums-and-techniques/))*

> 유한 합을 등차·등비 공식, 섭동, 망원 기법으로 계산하고 한계를 잡는다.

## 개념
핵심 닫힌 꼴: 등차 $\sum_{k=1}^n k=\tfrac{n(n+1)}{2}$; 등비
$\sum_{k=0}^{n} x^k=\tfrac{x^{n+1}-1}{x-1}$. **섭동법(perturbation)** 은 합을 두 가지로 써서
풀고, **망원(telescoping)** 은 연속 항을 상쇄한다.

## 왜 중요한가
실행시간 분석은 끊임없이 합을 만든다(루프 비용, 재귀 트리 레벨). 닫힌 꼴이나 빡빡한 한계를
알면 합이 깔끔한 $\Theta(\cdot)$ 가 된다.

## 세부
등비급수가 지배한다: $x>1$ 이면 합은 $\Theta(x^n)$ (마지막 항 우세), $x<1$ 이면
$\tfrac{1}{1-x}$ 로 수렴(첫 항 우세). 조화수 $H_n=\sum 1/k\approx\ln n$.

## 관련
[점근 분석과 적분 한계 (Asymptotics, Integral Bounds)](/portfolio/study/asymptotics-and-integral-bounds.ko/) · [생성함수 (Generating Functions)](/portfolio/study/generating-functions.ko/)
