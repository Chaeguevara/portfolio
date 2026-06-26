---
type: concept
title: QR Factorization
lang: en
pair: "[[qr-factorization.ko]]"
course: "18.06"
lectures: [17]
summary: A = QR with Q orthonormal and R upper-triangular; the stable way to do least squares.
tags: [orthogonality, factorization]
prereqs: [[[gram-schmidt]]]
related: [[[gram-schmidt]], [[least-squares]], [[orthogonal-matrix]]]
source: [[[L17-orthogonal-matrices-and-gram-schmidt]]]
status: draft
---
# QR Factorization

*(한국어: [QR 분해 (QR Factorization)](/portfolio/study/qr-factorization.ko/))*

> A = QR with Q orthonormal and R upper-triangular; the stable way to do least squares.

## Idea
[Gram–Schmidt Orthogonalization](/portfolio/study/gram-schmidt/) applied to the columns of $A$ produces orthonormal columns $Q$ and an
upper-triangular $R$ of coefficients:
$$
A = QR,\qquad Q^TQ=I.
$$

## Why it matters
Second of the great factorizations. It makes [Least Squares](/portfolio/study/least-squares/) numerically stable: the
normal equations become $R\hat x = Q^Tb$ (just back-substitution, no $A^TA$).

## Details
- $R = Q^TA$; its diagonal entries are the Gram–Schmidt normalizing lengths.
- $Q$ is an [Orthogonal Matrix](/portfolio/study/orthogonal-matrix/) (or has orthonormal columns when $A$ is tall).
- Also the basis for the **QR algorithm** for eigenvalues.

## Related
[Gram–Schmidt Orthogonalization](/portfolio/study/gram-schmidt/) · [Least Squares](/portfolio/study/least-squares/) · [Orthogonal Matrix](/portfolio/study/orthogonal-matrix/)
