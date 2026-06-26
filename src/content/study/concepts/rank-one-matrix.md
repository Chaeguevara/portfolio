---
type: concept
title: Rank-One Matrices
lang: en
pair: "[[rank-one-matrix.ko]]"
course: "18.06"
lectures: [11]
summary: The simplest nonzero matrices, A = uv^T; every rank-r matrix is a sum of r of them.
tags: [subspaces]
prereqs: [[[rank]], [[matrix-multiplication]]]
related: [[[singular-value-decomposition]], [[rank]]]
source: [[[L11-matrix-spaces-rank-1-small-world-graphs]]]
status: draft
---
# Rank-One Matrices

*(한국어: [rank-1 행렬 (Rank-One Matrices)](/portfolio/study/rank-one-matrix.ko/))*

> The simplest nonzero matrices, A = uv^T; every rank-r matrix is a sum of r of them.

## Idea
A **rank-one matrix** is an outer product $A=uv^T$ (column times row). Every column is a
multiple of $u$, so $\operatorname{rank}=1$. Example:
$$
\begin{bmatrix} 1 \\ 2 \end{bmatrix}\begin{bmatrix} 3 & 4 \end{bmatrix}
= \begin{bmatrix} 3 & 4 \\ 6 & 8 \end{bmatrix}.
$$

## Why it matters
Rank-one pieces are the atoms of matrices: any rank-$r$ matrix is a sum of $r$ of them.
This is exactly what the [Singular Value Decomposition (SVD)](/portfolio/study/singular-value-decomposition/) does optimally
($A=\sum \sigma_i u_i v_i^T$), and it underlies low-rank approximation / compression.

## Related
[Singular Value Decomposition (SVD)](/portfolio/study/singular-value-decomposition/) · [Rank](/portfolio/study/rank/) · [Matrix Multiplication](/portfolio/study/matrix-multiplication/)
