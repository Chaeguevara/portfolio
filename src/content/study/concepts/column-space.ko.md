---
type: concept
title: 열공간 C(A) (Column Space)
lang: ko
pair: "[[column-space]]"
course: "18.06"
lectures: [6]
summary: A의 열들의 모든 선형결합 — Ax=b가 풀리는 b들의 집합.
tags: [subspaces]
prereqs: [[[vector-space-and-subspace.ko]]]
related: [[[nullspace.ko]], [[complete-solution-ax-b.ko]], [[rank.ko]], [[four-fundamental-subspaces.ko]]]
source: [[[L06-column-space-and-nullspace]]]
status: draft
---
# 열공간 C(A) (Column Space)

*(English: [Column Space C(A)](/portfolio/study/column-space/))*

> A의 열들의 모든 선형결합 — Ax=b가 풀리는 b들의 집합.

## 개념
**열공간(column space)** $C(A)$ 는 $A$ 의 열들이 생성(span)하는 공간으로, ($m\times n$
행렬에 대해) $\mathbb{R}^m$ 의 부분공간이다. 열 그림([Ax = b 의 세 가지 그림 (Row/Column/Matrix Pictures)](/portfolio/study/linear-system-pictures.ko/))에 의해
$Ax$ 는 정확히 열들의 결합이므로
$$
Ax=b \text{ 가 풀린다} \iff b \in C(A).
$$

## 왜 중요한가
**존재성(existence)** 에 답한다: 어떤 우변 $b$ 에 도달할 수 있는가. 그 차원이 [랭크](/portfolio/study/rank.ko/)다.
[네 기본 부분공간](/portfolio/study/four-fundamental-subspaces.ko/) 중 하나다.

## 세부
- $\dim C(A) = r$ (랭크) = 피벗 열의 개수.
- ($R$ 이 아니라) $A$ 의 피벗 열들이 $C(A)$ 의 기저를 이룬다.
- 보공간(complement): $C(A)^\perp = N(A^T)$ (왼쪽 영공간).

## 관련
[영공간 N(A) (Nullspace)](/portfolio/study/nullspace.ko/) · [랭크 (Rank)](/portfolio/study/rank.ko/) · [네 기본 부분공간 (Four Fundamental Subspaces)](/portfolio/study/four-fundamental-subspaces.ko/)
