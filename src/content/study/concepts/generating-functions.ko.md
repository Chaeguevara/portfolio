---
type: concept
title: 생성함수 (Generating Functions)
lang: ko
pair: "[[generating-functions]]"
course: "6.042J"
lectures: [17]
summary: 수열을 멱급수의 계수로 인코딩하고, 급수 위 대수로 셈·점화식을 푼다.
tags: [counting, recurrences]
prereqs: [[[counting-principles.ko]]]
related: [[[binomial-coefficients.ko]], [[linear-recurrences.ko]]]
source: [[[L17-counting-rules-ii]]]
status: draft
---
# 생성함수 (Generating Functions)

*(English: [Generating Functions](/portfolio/study/generating-functions/))*

> 수열을 멱급수의 계수로 인코딩하고, 급수 위 대수로 셈·점화식을 푼다.

## 개념
수열 $a_0,a_1,\dots$ 을 $G(x)=\sum_n a_n x^n$ 으로 만든다. 수열 연산이 $G$ 의 연산으로 사상된다:
이동, 합성곱(급수 곱 = 선택 결합), 스케일.

## 왜 중요한가
점화식과 제약 있는 셈을 대수로 바꾼다: $G(x)$ 를 닫힌 꼴로 풀고 계수로서 $a_n$ 을 읽어낸다.

## 세부
핵심 급수: $\tfrac{1}{1-x}=\sum x^n$; $\tfrac{1}{(1-x)^2}=\sum (n+1)x^n$;
$(1+x)^n=\sum\binom nk x^k$. 피보나치 점화식을 $G(x)=\tfrac{x}{1-x-x^2}$ 로 풀고 부분분수로
닫힌 꼴을 복원한다.

## 관련
[이항계수와 파스칼 삼각형 (Binomial Coefficients)](/portfolio/study/binomial-coefficients.ko/) · [선형 점화식 (Linear Recurrences)](/portfolio/study/linear-recurrences.ko/) · [셈하기: 합·곱 법칙과 전단사 (Counting Principles)](/portfolio/study/counting-principles.ko/)
