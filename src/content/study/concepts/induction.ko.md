---
type: concept
title: 수학적 귀납법 (Mathematical Induction)
lang: ko
pair: "[[induction]]"
course: "6.042J"
lectures: [2]
summary: 기저 사례와 'P(n)이면 P(n+1)'을 보여서 모든 n에 대해 P(n)을 증명한다.
tags: [proofs, induction]
prereqs: [[[proof-methods.ko]]]
related: [[[strong-induction.ko]], [[well-ordering-principle.ko]], [[linear-recurrences.ko]]]
source: [[[L02-induction]]]
status: draft
---
# 수학적 귀납법 (Mathematical Induction)

*(English: [Mathematical Induction](/portfolio/study/induction/))*

> 기저 사례와 'P(n)이면 P(n+1)'을 보여서 모든 n에 대해 P(n)을 증명한다.

## 개념
$\forall n\ge 0\;P(n)$ 을 증명하려면:
1. **기저 사례(base case):** $P(0)$ 을 보임.
2. **귀납 단계(inductive step):** $P(n)$ 을 가정(*귀납 가정*)하고 $P(n+1)$ 을 증명.
도미노 효과로 모든 $n$ 에 대해 $P(n)$ 이 성립한다.

## 왜 중요한가
모든 자연수에 대한 명제의 주력 도구: 합의 닫힌 꼴, 재귀 알고리즘의 정당성, 재귀적으로
정의된 대상의 성질.

## 세부
대표 예: $\sum_{k=1}^{n} k = \tfrac{n(n+1)}{2}$. 기저 $n=1$ 성립, 단계에서 양변에 $n+1$ 을
더한다. 함정: 기저 사례 누락, 목표를 몰래 가정하는 단계. **구조적 귀납법(structural
induction)** 은 이를 재귀적 자료로 일반화한다.

## 다이어그램

```mermaid
flowchart LR
    B["Base case: P(0) true"] --> S["Inductive step: P(n) implies P(n+1)"]
    S --> C["Conclusion: P(n) for all n >= 0"]
```

## 관련
[강한 귀납법 (Strong Induction)](/portfolio/study/strong-induction.ko/) · [정렬 원리 (Well-Ordering Principle)](/portfolio/study/well-ordering-principle.ko/) · [선형 점화식 (Linear Recurrences)](/portfolio/study/linear-recurrences.ko/)
