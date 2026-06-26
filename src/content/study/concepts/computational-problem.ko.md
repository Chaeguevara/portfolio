---
type: concept
title: 계산 문제와 알고리즘 (Computational Problems, Algorithms)
lang: ko
pair: "[[computational-problem]]"
course: "6.006"
lectures: [1]
summary: 문제는 입력을 올바른 출력으로 대응시키고, 알고리즘은 모든 사례를 푸는 절차이며 귀납법으로 정당성을 증명한다.
tags: [foundations]
prereqs: []
related: [[[asymptotic-notation.ko]], [[word-ram-model.ko]]]
source: [[[L01-algorithms-and-computation]]]
status: draft
---
# 계산 문제와 알고리즘 (Computational Problems, Algorithms)

*(English: [Computational Problems & Algorithms](/portfolio/study/computational-problem/))*

> 문제는 입력을 올바른 출력으로 대응시키고, 알고리즘은 모든 사례를 푸는 절차이며 귀납법으로 정당성을 증명한다.

## 개념
**계산 문제(computational problem)** 는 입력에서 허용 출력으로의 이항관계(흔히 함수)다.
**알고리즘** 은 *모든* 유효 입력에 대해 멈추며 올바른 출력을 내는 유한 절차다. 정당성은 보통
귀납법(입력 크기나 루프 반복에 대해)으로, 효율은 연산 수를 세서 증명한다.

## 왜 중요한가
강의 전체가 따르는 계약이다: *무엇*(문제)과 *어떻게*(알고리즘)를 분리해 같은 문제의 여러
알고리즘을 비교한다.

## 세부
한 문제에 비용이 다른 여러 알고리즘이 있을 수 있다. "푼다"는 테스트한 입력이 아니라 모든
입력에서 옳음을 뜻한다 — 그래서 증명이 필요하다. 효율은 입력 크기 $n$ 의 점근으로 잰다.

## 관련
[점근 표기법 (Big-O)](/portfolio/study/asymptotic-notation.ko/) · [워드-RAM 모델 (Word-RAM Model)](/portfolio/study/word-ram-model.ko/)
