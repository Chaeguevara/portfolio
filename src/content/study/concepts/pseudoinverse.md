---
type: concept
title: Pseudoinverse
lang: en
pair: "[[pseudoinverse.ko]]"
course: "18.06"
lectures: [33]
summary: A^+ = VΣ^+U^T extends the inverse to any matrix; gives least-squares / minimum-norm solutions.
tags: [special-matrices]
prereqs: [[[singular-value-decomposition]], [[least-squares]]]
related: [[[singular-value-decomposition]], [[least-squares]], [[four-fundamental-subspaces]]]
source: [[[L33-left-and-right-inverses-pseudoinverse]]]
status: draft
---
# Pseudoinverse

*(한국어: [유사역행렬 (Pseudoinverse)](/portfolio/study/pseudoinverse.ko/))*

> A^+ = VΣ^+U^T extends the inverse to any matrix; gives least-squares / minimum-norm solutions.

## Idea
From the [Singular Value Decomposition (SVD)](/portfolio/study/singular-value-decomposition/) $A=U\Sigma V^T$, the **pseudoinverse** (Moore–
Penrose) is
$$
A^+ = V\Sigma^+ U^T,
$$
where $\Sigma^+$ inverts the nonzero singular values and transposes. It is the closest thing
to an inverse for non-square or rank-deficient $A$.

## Why it matters
$A^+b$ is the **best solution** to $Ax=b$ for any shape:
- overdetermined (tall $A$): the [Least Squares](/portfolio/study/least-squares/) solution;
- underdetermined (wide $A$): the **minimum-norm** solution.
On the row/column spaces $A^+$ acts as a true inverse; on the nullspaces it is zero.

## Details
- If $A$ is invertible, $A^+=A^{-1}$.
- $A^+ = (A^TA)^{-1}A^T$ when columns are independent (the least-squares formula).

## Related
[Singular Value Decomposition (SVD)](/portfolio/study/singular-value-decomposition/) · [Least Squares](/portfolio/study/least-squares/) · [The Four Fundamental Subspaces](/portfolio/study/four-fundamental-subspaces/)
