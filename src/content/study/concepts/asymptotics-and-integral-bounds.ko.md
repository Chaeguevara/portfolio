---
type: concept
title: 점근 분석과 적분 한계 (Asymptotics, Integral Bounds)
lang: ko
pair: "[[asymptotics-and-integral-bounds]]"
course: "6.042J"
lectures: [13]
summary: 빅오/세타/오메가가 증가율을 비교하고, 합은 적분으로 한계 짓고, 스털링으로 n!을 근사한다.
tags: [asymptotics]
prereqs: [[[sums-and-techniques.ko]]]
related: [[[divide-and-conquer-recurrences.ko]]]
source: [[[L13-sums-and-asymptotics]]]
status: draft
---
# 점근 분석과 적분 한계 (Asymptotics, Integral Bounds)

*(English: [Asymptotics & Integral Bounds](/portfolio/study/asymptotics-and-integral-bounds/))*

> 빅오/세타/오메가가 증가율을 비교하고, 합은 적분으로 한계 짓고, 스털링으로 n!을 근사한다.

## 개념
$f=O(g)$ 는 $f$ 가 $g$ 보다 빠르지 않게 자란다는 뜻(상수배까지); $\Omega$ 는 하한, $\Theta$ 는
둘 다. 단조 합은 적분으로 끼인다: 증가하는 $f$ 에 대해
$\int_1^{n} f\,dx \le \sum_{k=1}^{n} f(k) \le f(1)+\int_1^{n} f\,dx$.

## 왜 중요한가
닫힌 꼴이 없는 합(예: $\sum\ln k$)에 빡빡한 한계를 얻는 표준 방법이자, 알고리즘 비용 비교의
공통 언어다.

## 세부
**스털링 근사:** $n!\sim \sqrt{2\pi n}\,(n/e)^n$, 따라서 $\ln n!=\Theta(n\ln n)$ — 이것이
비교 정렬의 하한이다. 적분 한계로 $H_n=\ln n+\Theta(1)$.

## 관련
[합과 합산 기법 (Sums & Summation Techniques)](/portfolio/study/sums-and-techniques.ko/) · [분할정복 점화식과 마스터 정리](/portfolio/study/divide-and-conquer-recurrences.ko/)
