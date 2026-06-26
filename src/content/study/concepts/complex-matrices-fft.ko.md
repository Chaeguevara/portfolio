---
type: concept
title: 복소 행렬과 FFT (Complex Matrices & FFT)
lang: ko
pair: "[[complex-matrices-fft]]"
course: "18.06"
lectures: [26]
summary: 에르미트/유니터리는 대칭/직교의 복소판. 푸리에 행렬이 분해되어 O(n log n) FFT를 준다.
tags: [special-matrices, applications]
prereqs: [[[orthogonal-matrix.ko]]]
related: [[[orthogonal-matrix.ko]], [[symmetric-matrix.ko]]]
source: [[[L26-complex-matrices-fast-fourier-transform]]]
status: draft
---
# 복소 행렬과 FFT (Complex Matrices & FFT)

*(English: [Complex Matrices & the FFT](/portfolio/study/complex-matrices-fft/))*

> 에르미트/유니터리는 대칭/직교의 복소판. 푸리에 행렬이 분해되어 O(n log n) FFT를 준다.

## 개념
$\mathbb{C}$ 위에서는 전치가 **켤레전치(conjugate transpose)** $A^*$ 가 된다. **에르미트
(Hermitian)** ($A=A^*$)가 대칭의 역할(실수 고유값), **유니터리(unitary)** ($U^*U=I$)가
직교의 역할을 한다. **푸리에 행렬(Fourier matrix)** $F_n$ (성분 $\omega^{jk}$,
$\omega=e^{2\pi i/n}$)은 스케일을 빼면 유니터리다.

## 왜 중요한가
**FFT** 는 $F_n$ 을 $F_{n/2}$ 로 표현해 희소 조각들로 분해하여, 이산 푸리에 변환을
$O(n^2)$ 에서 $O(n\log n)$ 으로 줄인다 — 컴퓨팅에서 가장 중요한 알고리즘 중 하나(신호처리,
빠른 합성곱).

## 세부
- $\langle x,y\rangle = \bar x^Ty$; 길이는 $|z|^2$ 사용.
- 에르미트 행렬의 고유값은 실수, 유니터리는 단위원 위.

## 관련
[직교 행렬 (Orthogonal Matrix)](/portfolio/study/orthogonal-matrix.ko/) · [대칭 행렬과 스펙트럼 정리 (Symmetric Matrices)](/portfolio/study/symmetric-matrix.ko/)
