---
type: concept
title: 직교 행렬 (Orthogonal Matrix)
lang: ko
pair: "[[orthogonal-matrix]]"
course: "18.06"
lectures: [17]
summary: "정규직교 열을 가진 정사각 행렬 Q: Q^TQ=I, 따라서 Q^{-1}=Q^T. 길이와 각을 보존한다."
tags: [orthogonality]
prereqs: [[[orthogonality.ko]]]
related: [[[qr-factorization.ko]], [[symmetric-matrix.ko]], [[singular-value-decomposition.ko]]]
source: [[[L17-orthogonal-matrices-and-gram-schmidt]]]
status: draft
---
직교 행렬 (Orthogonal Matrix)

*(English: [Orthogonal Matrix](/portfolio/study/orthogonal-matrix/))*

> 정규직교 열을 가진 정사각 행렬 Q: Q^TQ=I, 따라서 Q^{-1}=Q^T. 길이와 각을 보존한다.

## 개념
$Q$ 가 **직교(orthogonal)** 라는 것은 열이 정규직교, 즉 $Q^TQ=I$ 라는 뜻이다. 그러면
$Q^{-1}=Q^T$ 이고 $\|Qx\|=\|x\|$ — $Q$ 를 곱하는 건 회전/반사다.

## 왜 중요한가
직교 행렬은 "가장 좋은" 행렬이다: 조건수가 완벽하고 역이 쉬우며,
[QR](/portfolio/study/qr-factorization.ko/)($Q$), [대칭행렬](/portfolio/study/symmetric-matrix.ko/)의 스펙트럼 정리($A=Q\Lambda Q^T$),
[SVD](/portfolio/study/singular-value-decomposition.ko/)($U,V$)에 등장한다.

## 세부
- $\det Q = \pm 1$; 고유값은 $|\lambda|=1$.
- 예: 회전, 반사, **순열 행렬**.
- 직교 행렬들의 곱도 직교다.

## 관련
[QR 분해 (QR Factorization)](/portfolio/study/qr-factorization.ko/) · [대칭 행렬과 스펙트럼 정리 (Symmetric Matrices)](/portfolio/study/symmetric-matrix.ko/) · [특이값 분해 (SVD)](/portfolio/study/singular-value-decomposition.ko/)
