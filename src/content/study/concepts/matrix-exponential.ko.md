---
type: concept
title: 행렬 지수와 미분방정식 (Matrix Exponential)
lang: ko
pair: "[[matrix-exponential]]"
course: "18.06"
lectures: [23]
summary: du/dt = Au를 u(t)=e^{At}u(0)로 푼다. e^{At}=Se^{Λt}S^{-1}로 계산.
tags: [eigenvalues, applications]
prereqs: [[[diagonalization.ko]]]
related: [[[diagonalization.ko]], [[eigenvalues-eigenvectors.ko]], [[markov-matrix.ko]]]
source: [[[L23-differential-equations-and-exp-at]]]
status: draft
---
# 행렬 지수와 미분방정식 (Matrix Exponential)

*(English: [Matrix Exponential & Differential Equations](/portfolio/study/matrix-exponential/))*

> du/dt = Au를 u(t)=e^{At}u(0)로 푼다. e^{At}=Se^{Λt}S^{-1}로 계산.

## 개념
연립 $\frac{du}{dt}=Au$ 의 해는 $u(t)=e^{At}u(0)$ 이고, **행렬 지수(matrix exponential)** 는
$e^{At}=\sum_k \frac{(At)^k}{k!}$ 다. [대각화](/portfolio/study/diagonalization.ko/)를 통해
$$
e^{At} = S\,e^{\Lambda t}\,S^{-1},\qquad e^{\Lambda t}=\operatorname{diag}(e^{\lambda_i t}).
$$

## 왜 중요한가
$A^k$ 의 연속시간 대응물이다: 이제 고유값이 **성장/감쇠율**을 좌우한다. 모든 $\lambda$ 에
대해 $\operatorname{Re}(\lambda)<0$ ⇒ 계가 **안정(stable)** (0으로 감쇠).

## 세부
- 고유벡터 방향들은 $e^{\lambda t}$ 로 독립적으로 진화한다.
- 2계 ODE는 $u$ 와 $u'$ 을 쌓아 1계 연립으로 바꾼다.
- 이산 [대각화와 거듭제곱 (Diagonalization & Powers)](/portfolio/study/diagonalization.ko/)($|\lambda|<1$ 안정) vs 연속($\operatorname{Re}\lambda<0$) 비교.

## 관련
[대각화와 거듭제곱 (Diagonalization & Powers)](/portfolio/study/diagonalization.ko/) · [고유값과 고유벡터 (Eigenvalues & Eigenvectors)](/portfolio/study/eigenvalues-eigenvectors.ko/) · [마르코프 행렬 (Markov Matrices)](/portfolio/study/markov-matrix.ko/)
