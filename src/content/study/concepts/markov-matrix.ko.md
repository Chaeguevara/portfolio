---
type: concept
title: 마르코프 행렬 (Markov Matrices)
lang: ko
pair: "[[markov-matrix]]"
course: "18.06"
lectures: [24]
summary: 열의 합이 1인 비음수 행렬. λ=1이 항상 고유값이고 그 고유벡터가 정상상태.
tags: [eigenvalues, applications]
prereqs: [[[eigenvalues-eigenvectors.ko]]]
related: [[[diagonalization.ko]], [[eigenvalues-eigenvectors.ko]]]
source: [[[L24-markov-matrices-fourier-series]]]
status: draft
---
# 마르코프 행렬 (Markov Matrices)

*(English: [Markov Matrices](/portfolio/study/markov-matrix/))*

> 열의 합이 1인 비음수 행렬. λ=1이 항상 고유값이고 그 고유벡터가 정상상태.

## 개념
**마르코프 행렬(Markov matrix)** 은 성분이 $\ge 0$ 이고 각 **열의 합이 1**(확률)이다. 그러면
$\lambda=1$ 이 항상 고유값이고, 모든 고유값이 $|\lambda|\le 1$ 을 만족한다.

## 왜 중요한가
확률 흐름/무작위 전이를 모델링한다. 반복 적용 $u_k=A^ku_0$ 은 **정상상태(steady state)**
로 수렴한다 — $\lambda=1$ 의 고유벡터(나머지 $|\lambda|<1$ 일 때). PageRank와 평형분포의
바탕 수학이다.

## 세부
- 열의 합이 1 ⇒ $(1,1,\dots,1)$ 이 왼쪽 고유벡터이므로 $\lambda=1$ 존재.
- 정상상태는 $(A-I)x=0$ 을 풀고 정규화해 구한다.

## 관련
[고유값과 고유벡터 (Eigenvalues & Eigenvectors)](/portfolio/study/eigenvalues-eigenvectors.ko/) · [대각화와 거듭제곱 (Diagonalization & Powers)](/portfolio/study/diagonalization.ko/)
