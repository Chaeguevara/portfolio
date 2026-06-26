---
type: concept
title: 여인수 전개 (Cofactor Expansion)
lang: ko
pair: "[[cofactor-expansion]]"
course: "18.06"
lectures: [19]
summary: 부호 있는 소행렬식(여인수)으로 행/열을 따라 전개해 det A를 계산.
tags: [determinants]
prereqs: [[[determinant.ko]]]
related: [[[determinant.ko]], [[cramers-rule.ko]]]
source: [[[L19-determinant-formulas-and-cofactors]]]
status: draft
---
# 여인수 전개 (Cofactor Expansion)

*(English: [Cofactor Expansion](/portfolio/study/cofactor-expansion/))*

> 부호 있는 소행렬식(여인수)으로 행/열을 따라 전개해 det A를 계산.

## 개념
$i$ 행을 따라 전개:
$$
\det A = \sum_{j} a_{ij}\,C_{ij},\qquad C_{ij}=(-1)^{i+j}\det M_{ij},
$$
여기서 $M_{ij}$ 는 $A$ 에서 $i$ 행과 $j$ 열을 지운 것(**소행렬, minor**), $C_{ij}$ 는 부호 있는
**여인수(cofactor)** 다.

## 왜 중요한가
행렬식의 재귀 공식을 주고, 여인수 행렬을 통해 역행렬의 명시적 공식
$A^{-1}=\frac{1}{\det A}C^T$ (수반행렬, adjugate)을 준다. $\det$ 에서 [[cramers-rule.ko|크라메르
공식]]으로 가는 다리다.

## 세부
- 0이 많은 행/열을 따라 전개하는 게 가장 좋다.
- 이론적으론 깔끔하지만 직접 계산은 **지수적** — 실제로는 소거(피벗들의 곱)가 답이다.

## 관련
[행렬식 (Determinant)](/portfolio/study/determinant.ko/) · [크라메르 공식과 부피 (Cramer's Rule)](/portfolio/study/cramers-rule.ko/) · [역행렬 (Matrix Inverse)](/portfolio/study/matrix-inverse.ko/)
