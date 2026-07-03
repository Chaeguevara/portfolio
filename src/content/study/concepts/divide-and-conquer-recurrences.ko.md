---
type: concept
title: 분할정복 점화식과 마스터 정리
lang: ko
pair: "[[divide-and-conquer-recurrences]]"
course: "6.042J"
lectures: [14]
summary: 점화식 T(n)=aT(n/b)+f(n)은 재귀 트리로 풀리며, 마스터 정리로 요약된다.
tags: [recurrences, asymptotics]
prereqs: [[[strong-induction.ko]]]
related: [[[linear-recurrences.ko]], [[asymptotics-and-integral-bounds.ko]]]
source: [[[L14-divide-and-conquer-recurrences]]]
status: draft
---
# 분할정복 점화식과 마스터 정리

*(English: [Divide-and-Conquer Recurrences & Master Theorem](/portfolio/study/divide-and-conquer-recurrences/))*

> 점화식 T(n)=aT(n/b)+f(n)은 재귀 트리로 풀리며, 마스터 정리로 요약된다.

## 개념
분할정복은 크기 $n/b$ 의 부분호출 $a$ 개와 $f(n)$ 작업을 한다: $T(n)=aT(n/b)+f(n)$.
**재귀 트리(recursion tree)** 가 레벨별 작업을 합하며, 꼭대기·바닥·전체 중 무엇이 지배하느냐로
세 경우가 나뉜다.

## 왜 중요한가
병합 정렬, 이진 탐색, Karatsuba, Strassen, FFT 를 아우른다 — $a,b,f$ 만 알면 한 정리로
실행시간을 읽어낸다.

## 세부
$f(n)$ 을 $n^{\log_b a}$ 와 비교: $f$ 가 다항적으로 작으면 $T=\Theta(n^{\log_b a})$, 같으면(로그
차이까지) $T=\Theta(n^{\log_b a}\log n)$, 크고 정규적이면 $T=\Theta(f(n))$. 병합 정렬:
$a=b=2,f=n\Rightarrow \Theta(n\log n)$.

## 관련
[선형 점화식 (Linear Recurrences)](/portfolio/study/linear-recurrences.ko/) · [강한 귀납법 (Strong Induction)](/portfolio/study/strong-induction.ko/) · [점근 분석과 적분 한계 (Asymptotics, Integral Bounds)](/portfolio/study/asymptotics-and-integral-bounds.ko/)
