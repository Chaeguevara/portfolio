---
type: concept
title: 행렬식 (Determinant)
lang: ko
pair: "[[determinant]]"
course: "18.06"
lectures: [18]
summary: 단일 수 det A. A가 비가역일 때 정확히 0이며, 부호 있는 부피이자 피벗들의 곱.
tags: [determinants]
prereqs: [[[gaussian-elimination.ko]]]
related: [[[cofactor-expansion.ko]], [[cramers-rule.ko]], [[eigenvalues-eigenvectors.ko]]]
source: [[[L18-properties-of-determinants]]]
status: draft
---
# 행렬식 (Determinant)

*(English: [Determinant](/portfolio/study/determinant/))*

> 단일 수 det A. A가 비가역일 때 정확히 0이며, 부호 있는 부피이자 피벗들의 곱.

## 개념
**행렬식(determinant)** 은 세 성질로 정의된다: $\det I=1$; 행을 바꾸면 **부호가 바뀜**;
각 행에 대해 따로 **선형**. 나머지는 다 여기서 나온다.

## 왜 중요한가
- $\det A = 0 \iff A$ 가 비가역(singular).
- $|\det A|$ = 행/열이 만드는 상자의 부피.
- [고유값](/portfolio/study/eigenvalues-eigenvectors.ko/)의 **특성방정식** $\det(A-\lambda I)=0$ 을 만든다.

## 세부
- $\det A = $ 피벗들의 곱(행 교환 부호 포함).
- $\det(AB)=\det A\,\det B$, $\det(A^T)=\det A$, $\det(A^{-1})=1/\det A$.
- 삼각행렬의 행렬식은 대각의 곱.

## 관련
[여인수 전개 (Cofactor Expansion)](/portfolio/study/cofactor-expansion.ko/) · [크라메르 공식과 부피 (Cramer's Rule)](/portfolio/study/cramers-rule.ko/) · [고유값과 고유벡터 (Eigenvalues & Eigenvectors)](/portfolio/study/eigenvalues-eigenvectors.ko/)
