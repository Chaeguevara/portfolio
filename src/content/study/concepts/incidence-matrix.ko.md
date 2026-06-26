---
type: concept
title: 접속 행렬 (Incidence Matrix, 그래프·회로망)
lang: ko
pair: "[[incidence-matrix]]"
course: "18.06"
lectures: [12]
summary: 그래프를 담은 행렬(간선×노드). 그 네 부분공간이 루프·전위·키르히호프 법칙에 대응한다.
tags: [subspaces, applications]
prereqs: [[[four-fundamental-subspaces.ko]]]
related: [[[four-fundamental-subspaces.ko]], [[nullspace.ko]]]
source: [[[L12-graphs-networks-incidence-matrices]]]
status: draft
---
# 접속 행렬 (Incidence Matrix, 그래프·회로망)

*(English: [Incidence Matrices (Graphs & Networks)](/portfolio/study/incidence-matrix/))*

> 그래프를 담은 행렬(간선×노드). 그 네 부분공간이 루프·전위·키르히호프 법칙에 대응한다.

## 개념
**접속 행렬(incidence matrix)** $A$ 는 간선마다 한 행, 노드마다 한 열을 가진다: 각 간선
행은 시작 노드에 $-1$, 끝 노드에 $+1$. $Ax$ 는 간선을 가로지르는 **전위차(potential
difference)** 를 잰다.

## 왜 중요한가
[네 기본 부분공간](/portfolio/study/four-fundamental-subspaces.ko/)의 가장 깔끔한 응용이다:
- $N(A)$ = 일정한 전위(모두 1인 벡터) ⇒ 연결 그래프면 $\dim=1$.
- $N(A^T)$ = 독립적인 **루프(loop)** (키르히호프 전류 법칙).
- $C(A^T)$ 는 신장 트리(spanning tree)와 관련, $\operatorname{rank} = \#\text{노드} - 1$.
- 오일러 공식(노드 $-$ 간선 $+$ 루프 $=1$)이 이 차원들에서 나온다.

## 관련
[네 기본 부분공간 (Four Fundamental Subspaces)](/portfolio/study/four-fundamental-subspaces.ko/) · [영공간 N(A) (Nullspace)](/portfolio/study/nullspace.ko/)
