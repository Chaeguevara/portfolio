---
type: concept
title: 닮은 행렬과 조르당 형 (Jordan Form)
lang: ko
pair: "[[jordan-form]]"
course: "18.06"
lectures: [28]
summary: 닮은 행렬 B=M^{-1}AM은 고유값을 공유한다. 조르당 형은 대각화 불가능한 A의 표준 준대각 형태.
tags: [special-matrices]
prereqs: [[[diagonalization.ko]]]
related: [[[diagonalization.ko]], [[eigenvalues-eigenvectors.ko]]]
source: [[[L28-similar-matrices-and-jordan-form]]]
status: draft
---
# 닮은 행렬과 조르당 형 (Jordan Form)

*(English: [Similar Matrices & Jordan Form](/portfolio/study/jordan-form/))*

> 닮은 행렬 B=M^{-1}AM은 고유값을 공유한다. 조르당 형은 대각화 불가능한 A의 표준 준대각 형태.

## 개념
$A$ 와 $B$ 가 **닮음(similar)** 이라는 것은 $B=M^{-1}AM$ — 다른 기저에서의 같은 사상이다.
닮은 행렬은 **같은 고유값**(과 trace, 행렬식, 랭크)을 가진다. $A$ 가 **결손(defective)**
(고유벡터 부족)이면 대각에 가장 가까운 것이 **조르당 형(Jordan form)** 이다: 대각에
$\lambda$, 바로 위에 $1$ 이 있는 **조르당 블록**들의 블록대각.

## 왜 중요한가
고유값 이론을 완성한다: 모든 행렬이 조르당 형과 닮으므로, [대각화](/portfolio/study/diagonalization.ko/)가
실패하는 중복 고유값 상황을 설명한다.

## 세부
- 크기 $k$ 의 $\lambda$ 조르당 블록은 고유벡터 1개와 $k$ 개의 일반화 고유벡터 사슬을 가진다.
- 기하적 중복도(고유벡터 수) $\le$ 대수적 중복도(중근 수).
- 대체로 이론적(수치적으로 불안정)이지만 개념적으로 결정적.

## 관련
[대각화와 거듭제곱 (Diagonalization & Powers)](/portfolio/study/diagonalization.ko/) · [고유값과 고유벡터 (Eigenvalues & Eigenvectors)](/portfolio/study/eigenvalues-eigenvectors.ko/)
