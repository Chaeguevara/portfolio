---
type: concept
title: 독립·기저·차원 (Independence, Basis, Dimension)
lang: ko
pair: "[[independence-basis-dimension]]"
course: "18.06"
lectures: [9]
summary: 독립 벡터는 0을 만드는 결합이 자명한 것뿐. 기저는 독립이면서 생성하는 집합이고, 그 크기가 차원.
tags: [subspaces]
prereqs: [[[vector-space-and-subspace.ko]]]
related: [[[rank.ko]], [[column-space.ko]], [[four-fundamental-subspaces.ko]]]
source: [[[L09-independence-basis-and-dimension]]]
status: draft
---
# 독립·기저·차원 (Independence, Basis, Dimension)

*(English: [Independence, Basis, Dimension](/portfolio/study/independence-basis-dimension/))*

> 독립 벡터는 0을 만드는 결합이 자명한 것뿐. 기저는 독립이면서 생성하는 집합이고, 그 크기가 차원.

## 개념
벡터 $v_1,\dots,v_k$ 가 **독립(independent)** 이라는 것은 $c_1v_1+\dots+c_kv_k=0$ 이 모든
$c_i=0$ 을 강제한다는 뜻이다. 모든 벡터가 이들의 결합이면 공간을 **생성(span)** 한다.
**기저(basis)** 는 독립이면서 생성하는 집합이고, **차원(dimension)** 은 임의의 기저에 든
벡터 개수(항상 같다)다.

## 왜 중요한가
기저+차원이 부분공간을 정확히 결정하며, 차원이 [[four-fundamental-subspaces.ko|네 기본
부분공간]] 정리가 세는 양이다. 열의 독립 $\iff N(A)=\{0\}$ $\iff$ 열 풀 [랭크](/portfolio/study/rank.ko/).

## 세부
- 독립 집합은 기저로 확장 가능, 생성 집합은 기저로 축소 가능.
- $\mathbb{R}^n$ 의 모든 기저는 정확히 $n$ 개의 벡터를 가진다.
- $A$ 에서: 피벗 열이 $C(A)$ 의 기저, 특수해가 $N(A)$ 의 기저.

## 관련
[랭크 (Rank)](/portfolio/study/rank.ko/) · [네 기본 부분공간 (Four Fundamental Subspaces)](/portfolio/study/four-fundamental-subspaces.ko/) · [열공간 C(A) (Column Space)](/portfolio/study/column-space.ko/)
