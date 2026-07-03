---
type: concept
title: QR 분해 (QR Factorization)
lang: ko
pair: "[[qr-factorization]]"
course: "18.06"
lectures: [17]
summary: A = QR, Q는 정규직교, R은 위삼각. 최소제곱을 안정적으로 하는 방법.
tags: [orthogonality, factorization]
prereqs: [[[gram-schmidt.ko]]]
related: [[[gram-schmidt.ko]], [[least-squares.ko]], [[orthogonal-matrix.ko]]]
source: [[[L17-orthogonal-matrices-and-gram-schmidt]]]
status: draft
---
# QR 분해 (QR Factorization)

*(English: [QR Factorization](/portfolio/study/qr-factorization/))*

> A = QR, Q는 정규직교, R은 위삼각. 최소제곱을 안정적으로 하는 방법.

## 개념
$A$ 의 열에 [그람–슈미트](/portfolio/study/gram-schmidt.ko/)를 적용하면 정규직교 열 $Q$ 와 계수의 위삼각 $R$ 이
나온다:
$$
A = QR,\qquad Q^TQ=I.
$$

## 왜 중요한가
위대한 분해 중 두 번째. [최소제곱](/portfolio/study/least-squares.ko/)을 수치적으로 안정시킨다: 정규방정식이
$R\hat x = Q^Tb$ 가 된다(후진대입만, $A^TA$ 불필요).

## 세부
- $R = Q^TA$; 대각 성분이 그람–슈미트 정규화 길이다.
- $Q$ 는 [직교 행렬](/portfolio/study/orthogonal-matrix.ko/)이다($A$ 가 세로로 길면 정규직교 열을 가짐).
- 고유값을 구하는 **QR 알고리즘**의 바탕이기도 하다.

## 관련
[그람–슈미트 직교화 (Gram–Schmidt)](/portfolio/study/gram-schmidt.ko/) · [최소제곱 (Least Squares)](/portfolio/study/least-squares.ko/) · [직교 행렬 (Orthogonal Matrix)](/portfolio/study/orthogonal-matrix.ko/)
