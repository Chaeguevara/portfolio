---
type: concept
title: 전치와 순열 행렬 (Transpose & Permutations)
lang: ko
pair: "[[transpose-and-permutations]]"
course: "18.06"
lectures: [5]
summary: A^T는 행과 열을 바꾼다. 순열 행렬 P는 행을 재배열하고 피벗팅을 처리한다(PA=LU).
tags: [foundations]
prereqs: [[[matrix-multiplication.ko]]]
related: [[[lu-factorization.ko]], [[symmetric-matrix.ko]], [[orthogonal-matrix.ko]]]
source: [[[L05-transposes-permutations-spaces-r-n]]]
status: draft
---
# 전치와 순열 행렬 (Transpose & Permutations)

*(English: [Transpose & Permutation Matrices](/portfolio/study/transpose-and-permutations/))*

> A^T는 행과 열을 바꾼다. 순열 행렬 P는 행을 재배열하고 피벗팅을 처리한다(PA=LU).

## 개념
**전치(transpose)** $A^T$ 는 $(A^T)_{ij}=A_{ji}$. **순열 행렬(permutation matrix)** $P$ 는
단위행렬의 행을 재배열한 것이고, $PA$ 는 $A$ 의 행을 치환한다.

## 왜 중요한가
- $A^T$ 는 **대칭(symmetric)** 행렬($A=A^T$, [대칭 행렬과 스펙트럼 정리 (Symmetric Matrices)](/portfolio/study/symmetric-matrix.ko/))을 정의하고,
  [최소제곱](/portfolio/study/least-squares.ko/)과 [네 기본 부분공간](/portfolio/study/four-fundamental-subspaces.ko/)에서
  $A^TA$ 로 등장한다.
- 순열은 [소거](/portfolio/study/gaussian-elimination.ko/)를 견고하게 만든다: 피벗이 0이면 행을 바꿔
  $PA = LU$ 가 된다.

## 세부
- $(AB)^T = B^T A^T$, $(A^T)^{-1} = (A^{-1})^T$.
- $A^TA$ 는 항상 대칭이고 준양의정부호(positive semidefinite).
- 순열 행렬은 **직교(orthogonal)**: $P^{-1}=P^T$ ([직교 행렬 (Orthogonal Matrix)](/portfolio/study/orthogonal-matrix.ko/)). 크기 $n!$ 의
  군을 이룬다.

## 관련
[대칭 행렬과 스펙트럼 정리 (Symmetric Matrices)](/portfolio/study/symmetric-matrix.ko/) · [LU 분해 (LU Factorization)](/portfolio/study/lu-factorization.ko/) · [직교 행렬 (Orthogonal Matrix)](/portfolio/study/orthogonal-matrix.ko/)
