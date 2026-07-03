---
type: concept
title: 벡터공간과 부분공간 (Vector Space & Subspace)
lang: ko
pair: "[[vector-space-and-subspace]]"
course: "18.06"
lectures: [5, 6]
summary: 덧셈과 스칼라배에 닫힌 집합. 부분공간은 다른 공간 안에 있는 그런 집합(0을 반드시 포함).
tags: [subspaces]
prereqs: []
related: [[[column-space.ko]], [[nullspace.ko]], [[independence-basis-dimension.ko]]]
source: [[[L05-transposes-permutations-spaces-r-n]], [[L06-column-space-and-nullspace]]]
status: draft
---
# 벡터공간과 부분공간 (Vector Space & Subspace)

*(English: [Vector Space & Subspace](/portfolio/study/vector-space-and-subspace/))*

> 덧셈과 스칼라배에 닫힌 집합. 부분공간은 다른 공간 안에 있는 그런 집합(0을 반드시 포함).

## 개념
**벡터공간(vector space)** 은 벡터를 더하고 스칼라배해도 그 안에 머무는, 통상의 공리를
만족하는 집합이다. $\mathbb{R}^n$ 의 **부분공간(subspace)** 은 두 연산에 닫힌 비어있지
않은 부분집합 — 즉 모든 선형결합에 닫힌 것이다. 모든 부분공간은 **영벡터를 포함**한다.

## 왜 중요한가
부분공간은 이 과목 전체가 다루는 대상이다: 원점을 지나는 직선/평면,
[열공간](/portfolio/study/column-space.ko/), [영공간](/portfolio/study/nullspace.ko/). 함정은 "원점을 지난다"는 것 — $0$ 을 지나지
않는 평면은 부분공간이 아니다.

## 세부
- $\mathbb{R}^3$ 의 예: $\{0\}$, 원점을 지나는 직선/평면, $\mathbb{R}^3$ 전체.
- 부분공간은 **기저(basis)** 와 **차원(dimension)** 으로 결정된다
  ([독립·기저·차원 (Independence, Basis, Dimension)](/portfolio/study/independence-basis-dimension.ko/) 참고).

## 관련
[열공간 C(A) (Column Space)](/portfolio/study/column-space.ko/) · [영공간 N(A) (Nullspace)](/portfolio/study/nullspace.ko/) · [독립·기저·차원 (Independence, Basis, Dimension)](/portfolio/study/independence-basis-dimension.ko/)
