---
type: concept
title: 포함–배제 원리 (Inclusion–Exclusion)
lang: ko
pair: "[[inclusion-exclusion]]"
course: "6.042J"
lectures: [17]
summary: 합집합을 셀 때 각 집합을 더하고 쌍교집합을 빼고 삼중교집합을 더하는 식으로 보정한다.
tags: [counting]
prereqs: [[[counting-principles.ko]]]
related: [[[pigeonhole-principle.ko]], [[probability-basics.ko]]]
source: [[[L17-counting-rules-ii]]]
status: draft
---
# 포함–배제 원리 (Inclusion–Exclusion)

*(English: [Inclusion–Exclusion](/portfolio/study/inclusion-exclusion/))*

> 합집합을 셀 때 각 집합을 더하고 쌍교집합을 빼고 삼중교집합을 더하는 식으로 보정한다.

## 개념
$|A\cup B|=|A|+|B|-|A\cap B|$, 일반적으로
$|A_1\cup\dots\cup A_n|=\sum|A_i|-\sum|A_i\cap A_j|+\dots$ 로 모든 교집합에 부호를 번갈아
붙인다.

## 왜 중요한가
"여러 조건 중 적어도 하나를 만족"으로 정의된 것을 세는 표준 방법이자, 여집합("나쁜 성질이
하나도 없음")을 세는 방법이다.

## 세부
**교란순열(derangement)** (고정점 없는 순열):
$D_n=n!\sum_{k=0}^n\tfrac{(-1)^k}{k!}\approx n!/e$. 포함–배제는 오일러 피 함수 $\phi(n)$ 과
합집합 확률 공식도 준다.

## 관련
[셈하기: 합·곱 법칙과 전단사 (Counting Principles)](/portfolio/study/counting-principles.ko/) · [비둘기집 원리 (Pigeonhole Principle)](/portfolio/study/pigeonhole-principle.ko/) · [확률 기초: 표본공간과 4단계 방법](/portfolio/study/probability-basics.ko/)
