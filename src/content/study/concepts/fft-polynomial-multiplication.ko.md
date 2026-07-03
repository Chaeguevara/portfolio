---
type: concept
title: FFT 와 다항식 곱셈 (FFT, Polynomial Multiplication)
lang: ko
pair: "[[fft-polynomial-multiplication]]"
course: "6.046J"
lectures: [5]
summary: 단위근에서 평가하고 다시 보간해 차수 n 다항식을 O(n log n)에 곱한다.
tags: [divide-and-conquer]
prereqs: []
related: [[[complex-matrices-fft.ko]], [[divide-and-conquer-recurrences.ko]]]
source: [[[L05-fast-fourier-transform]]]
status: draft
---
# FFT 와 다항식 곱셈 (FFT, Polynomial Multiplication)

*(English: [FFT & Polynomial Multiplication](/portfolio/study/fft-polynomial-multiplication/))*

> 단위근에서 평가하고 다시 보간해 차수 n 다항식을 O(n log n)에 곱한다.

## 개념
다항식은 계수 형태에서 곱셈이 느리지만($O(n^2)$) 값 형태에서는 **점별** 로 곱해진다. **FFT** 는
계수 $\to$ $n$ 개 복소 **단위근(roots of unity)** 에서의 값을 분할정복으로 $O(n\log n)$ 에
변환하고, 값을 점별로 곱한 뒤 역 FFT 로 되돌린다.

## 왜 중요한가
다항식·큰 정수 곱셈과 **합성곱(convolution)** 계산의 빠른 방법이다 — 신호 처리의 핵심이자
구조(단위근)를 속도로 바꾸는 우아한 예다.

## 세부
점화식 $T(n)=2T(n/2)+O(n)=O(n\log n)$, 다항식을 짝/홀수 인덱스 항으로 분할. 단위근 덕에 두
절반이 평가를 공유한다. 역 FFT 는 켤레근과 $1/n$ 스케일을 쓴 같은 알고리즘이다.

## 관련
[복소 행렬과 FFT (Complex Matrices & FFT)](/portfolio/study/complex-matrices-fft.ko/) · [분할정복 점화식과 마스터 정리](/portfolio/study/divide-and-conquer-recurrences.ko/)
