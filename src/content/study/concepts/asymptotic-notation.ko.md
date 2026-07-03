---
type: concept
title: 점근 표기법 (Big-O)
lang: ko
pair: "[[asymptotic-notation]]"
course: "6.006"
lectures: [1, 19]
summary: O·Ω·Θ는 입력 크기에 따른 실행시간 증가를 상수와 저차항을 숨기고 기술한다.
tags: [foundations, asymptotics]
prereqs: [[[computational-problem.ko]]]
related: [[[word-ram-model.ko]], [[asymptotics-and-integral-bounds.ko]]]
source: [[[L01-algorithms-and-computation]], [[L19-complexity]]]
status: draft
---
# 점근 표기법 (Big-O)

*(English: [Asymptotic Notation (Big-O)](/portfolio/study/asymptotic-notation/))*

> O·Ω·Θ는 입력 크기에 따른 실행시간 증가를 상수와 저차항을 숨기고 기술한다.

## 개념
$f=O(g)$: $f$ 가 많아야 $g$ 처럼 자람(상한); $\Omega$: 하한; $\Theta$: 둘 다, 빡빡한 한계.
상수와 저차항은 버려서 $3n^2+5n=\Theta(n^2)$.

## 왜 중요한가
알고리즘 비교를 기계 독립적으로 만든다: 큰 $n$ 에서 상수와 무관하게 $\Theta(n\log n)$ 이
$\Theta(n^2)$ 을 이긴다 — 점근 분석의 핵심.

## 세부
느린 순서대로 흔한 클래스: 상수 $\Theta(1)$, 로그 $\Theta(\log n)$, 선형 $\Theta(n)$,
$\Theta(n\log n)$, 이차 $\Theta(n^2)$, 다항 $\Theta(n^c)$, 지수 $\Theta(2^n)$. 실행시간과
공간 모두에 쓴다.

## 관련
[워드-RAM 모델 (Word-RAM Model)](/portfolio/study/word-ram-model.ko/) · [점근 분석과 적분 한계 (Asymptotics, Integral Bounds)](/portfolio/study/asymptotics-and-integral-bounds.ko/) · [계산 문제와 알고리즘 (Computational Problems, Algorithms)](/portfolio/study/computational-problem.ko/)
