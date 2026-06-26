---
type: concept
title: rank-1 행렬 (Rank-One Matrices)
lang: ko
pair: "[[rank-one-matrix]]"
course: "18.06"
lectures: [11]
summary: 가장 단순한 0 아닌 행렬 A = uv^T. 모든 랭크 r 행렬은 이것 r개의 합이다.
tags: [subspaces]
prereqs: [[[rank.ko]], [[matrix-multiplication.ko]]]
related: [[[singular-value-decomposition.ko]], [[rank.ko]]]
source: [[[L11-matrix-spaces-rank-1-small-world-graphs]]]
status: draft
---
# rank-1 행렬 (Rank-One Matrices)

*(English: [Rank-One Matrices](/portfolio/study/rank-one-matrix/))*

> 가장 단순한 0 아닌 행렬 A = uv^T. 모든 랭크 r 행렬은 이것 r개의 합이다.

## 개념
**rank-1 행렬**은 외적(outer product) $A=uv^T$ (열 곱하기 행)이다. 모든 열이 $u$ 의 배수라
$\operatorname{rank}=1$. 예:
$$
\begin{bmatrix} 1 \\ 2 \end{bmatrix}\begin{bmatrix} 3 & 4 \end{bmatrix}
= \begin{bmatrix} 3 & 4 \\ 6 & 8 \end{bmatrix}.
$$

## 왜 중요한가
rank-1 조각은 행렬의 원자다: 임의의 랭크 $r$ 행렬은 이것 $r$ 개의 합이다. 이것이 바로
[SVD](/portfolio/study/singular-value-decomposition.ko/)가 최적으로 하는 일이며($A=\sum \sigma_i u_i v_i^T$),
저랭크 근사/압축의 바탕이다.

## 관련
[특이값 분해 (SVD)](/portfolio/study/singular-value-decomposition.ko/) · [랭크 (Rank)](/portfolio/study/rank.ko/) · [행렬 곱셈 (Matrix Multiplication)](/portfolio/study/matrix-multiplication.ko/)
