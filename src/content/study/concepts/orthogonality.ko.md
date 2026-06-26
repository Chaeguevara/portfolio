---
type: concept
title: 직교성과 직교 보공간 (Orthogonality)
lang: ko
pair: "[[orthogonality]]"
course: "18.06"
lectures: [14]
summary: 내적이 0이면 직교. 부분공간의 직교 보공간은 그것에 수직인 모든 벡터의 집합.
tags: [orthogonality]
prereqs: [[[four-fundamental-subspaces.ko]]]
related: [[[projection.ko]], [[four-fundamental-subspaces.ko]], [[orthogonal-matrix.ko]]]
source: [[[L14-orthogonal-vectors-and-subspaces]]]
status: draft
---
# 직교성과 직교 보공간 (Orthogonality)

*(English: [Orthogonality & Orthogonal Complements](/portfolio/study/orthogonality/))*

> 내적이 0이면 직교. 부분공간의 직교 보공간은 그것에 수직인 모든 벡터의 집합.

## 개념
$x\perp y \iff x^Ty=0$. 부분공간 $S$ 의 **직교 보공간(orthogonal complement)** $S^\perp$ 은
$S$ 의 모든 벡터에 직교하는 벡터 전체다. 그러면 $\dim S + \dim S^\perp = n$ 이고
$S\oplus S^\perp=\mathbb{R}^n$.

## 왜 중요한가
[네 부분공간](/portfolio/study/four-fundamental-subspaces.ko/)의 짝을 설명한다: 행공간 $\perp$ 영공간, 열공간
$\perp$ 왼쪽 영공간. [사영](/portfolio/study/projection.ko/)과 [최소제곱](/portfolio/study/least-squares.ko/)의 토대다(임의의 $b$ 를
$C(A)$ 부분과 $N(A^T)$ 부분으로 분해).

## 세부
- 직교 벡터는 자동으로 독립이다.
- 길이: $\|x\|^2 = x^Tx$; 직교 벡터에 대해 피타고라스 성립.

## 관련
[부분공간으로의 사영 (Projection)](/portfolio/study/projection.ko/) · [네 기본 부분공간 (Four Fundamental Subspaces)](/portfolio/study/four-fundamental-subspaces.ko/) · [직교 행렬 (Orthogonal Matrix)](/portfolio/study/orthogonal-matrix.ko/)
