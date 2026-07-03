---
type: concept
title: 유사역행렬 (Pseudoinverse)
lang: ko
pair: "[[pseudoinverse]]"
course: "18.06"
lectures: [33]
summary: A^+ = VΣ^+U^T는 역행렬을 임의 행렬로 확장. 최소제곱·최소노름 해를 준다.
tags: [special-matrices]
prereqs: [[[singular-value-decomposition.ko]], [[least-squares.ko]]]
related: [[[singular-value-decomposition.ko]], [[least-squares.ko]], [[four-fundamental-subspaces.ko]]]
source: [[[L33-left-and-right-inverses-pseudoinverse]]]
status: draft
---
# 유사역행렬 (Pseudoinverse)

*(English: [Pseudoinverse](/portfolio/study/pseudoinverse/))*

> A^+ = VΣ^+U^T는 역행렬을 임의 행렬로 확장. 최소제곱·최소노름 해를 준다.

## 개념
[SVD](/portfolio/study/singular-value-decomposition.ko/) $A=U\Sigma V^T$ 로부터 **유사역행렬(pseudoinverse,
무어–펜로즈)** 은
$$
A^+ = V\Sigma^+ U^T,
$$
여기서 $\Sigma^+$ 는 0 아닌 특이값을 역수로 바꾸고 전치한 것이다. 비정사각·랭크 결손 $A$ 에
대해 역행렬에 가장 가까운 것이다.

## 왜 중요한가
$A^+b$ 는 어떤 모양의 $Ax=b$ 에 대해서도 **최적해**다:
- 과대결정(세로로 긴 $A$): [최소제곱](/portfolio/study/least-squares.ko/) 해;
- 과소결정(가로로 넓은 $A$): **최소노름(minimum-norm)** 해.
행/열공간에서 $A^+$ 는 진짜 역행렬처럼 작동하고, 영공간에서는 0이다.

## 세부
- $A$ 가 가역이면 $A^+=A^{-1}$.
- 열이 독립이면 $A^+ = (A^TA)^{-1}A^T$ (최소제곱 공식).

## 관련
[특이값 분해 (SVD)](/portfolio/study/singular-value-decomposition.ko/) · [최소제곱 (Least Squares)](/portfolio/study/least-squares.ko/) · [네 기본 부분공간 (Four Fundamental Subspaces)](/portfolio/study/four-fundamental-subspaces.ko/)
