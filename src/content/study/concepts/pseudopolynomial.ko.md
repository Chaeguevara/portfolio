---
type: concept
title: 유사다항 시간과 부분집합 합 (Pseudopolynomial, Subset Sum)
lang: ko
pair: "[[pseudopolynomial]]"
course: "6.006"
lectures: [18]
summary: 시간이 입력 길이가 아니라 수치 값에 의존하는 DP는 유사다항 시간이다 — 부분집합 합·배낭 문제.
tags: [dynamic-programming, complexity]
prereqs: [[[dynamic-programming.ko]]]
related: [[[dynamic-programming.ko]], [[complexity-classes.ko]]]
source: [[[L18-dynamic-programming-part-4-rods-subset-sum-pseudopolyno]]]
status: draft
---
# 유사다항 시간과 부분집합 합 (Pseudopolynomial, Subset Sum)

*(English: [Pseudopolynomial Time & Subset Sum](/portfolio/study/pseudopolynomial/))*

> 시간이 입력 길이가 아니라 수치 값에 의존하는 DP는 유사다항 시간이다 — 부분집합 합·배낭 문제.

## 개념
**부분집합 합(subset sum):** 주어진 정수들의 어떤 부분집합이 목표 $T$ 에 합하는가? (항목
인덱스, 달성 가능한 합)에 대한 DP 가 $O(nT)$ 에 푼다. 다항으로 보이지만 $T$ 는 그
**비트 수**(입력 크기)에 지수일 수 있다.

## 왜 중요한가
"효율적"과 "효율적으로 보임" 사이의 경계를 긋는다. 유사다항 알고리즘은 수가 작을 때 빠르지만,
그 밑의 문제(부분집합 합, 배낭)는 일반적으로 NP-난해다.

## 세부
실행시간 $O(nT)$ 는 *값* $T$ 에는 다항이지만 $\log T$ ($T$ 를 쓰는 비트 수)에는 지수다. 배낭이
그 최적화 사촌이다. 진짜 다항 시간은 입력 *길이* 에 다항이어야 한다.

## 관련
[동적 계획법 (SRTBOT) (Dynamic Programming)](/portfolio/study/dynamic-programming.ko/) · [복잡도 클래스: P, NP, EXP (Complexity Classes)](/portfolio/study/complexity-classes.ko/)
