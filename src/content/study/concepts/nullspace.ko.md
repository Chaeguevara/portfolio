---
type: concept
title: 영공간 N(A) (Nullspace)
lang: ko
pair: "[[nullspace]]"
course: "18.06"
lectures: [6, 7]
summary: Ax=0의 모든 해 — 차원이 n − 랭크인 R^n의 부분공간.
tags: [subspaces]
prereqs: [[[vector-space-and-subspace.ko]]]
related: [[[solving-ax-0.ko]], [[column-space.ko]], [[rank.ko]], [[four-fundamental-subspaces.ko]]]
source: [[[L06-column-space-and-nullspace]], [[L07-solving-ax-0-pivot-variables-special-solutions]]]
status: draft
---
# 영공간 N(A) (Nullspace)

*(English: [Nullspace N(A)](/portfolio/study/nullspace/))*

> Ax=0의 모든 해 — 차원이 n − 랭크인 R^n의 부분공간.

## 개념
**영공간(nullspace)** $N(A)=\{x : Ax=0\}$ 은 $\mathbb{R}^n$ 의 부분공간이다. 해의
**비유일성(non-uniqueness)** 을 포착한다: $Ax_p=b$ 이면 모든 해는 $x_n\in N(A)$ 에 대해
$x_p+x_n$ 이다([Ax = b의 완전해 (Complete Solution)](/portfolio/study/complete-solution-ax-b.ko/) 참고).

## 왜 중요한가
- $N(A)=\{0\}$ $\iff$ $A$ 의 열들이 독립 $\iff$ 해가 유일.
- $\dim N(A) = n - r$ (**nullity**, 영차원), 자유변수의 개수.

## 세부
- $Ax=0$ 을 풀어 구한다: RREF로 줄이고, 자유변수를 차례로 1로 놓아 $N(A)$ 를 생성하는
  **특수해(special solution)** 를 얻는다([Ax = 0 풀기: 피벗·자유변수·RREF](/portfolio/study/solving-ax-0.ko/) 참고).
- $N(A) = (C(A^T))^\perp$: 영공간은 행공간과 직교한다.

## 관련
[Ax = 0 풀기: 피벗·자유변수·RREF](/portfolio/study/solving-ax-0.ko/) · [랭크 (Rank)](/portfolio/study/rank.ko/) · [네 기본 부분공간 (Four Fundamental Subspaces)](/portfolio/study/four-fundamental-subspaces.ko/)
