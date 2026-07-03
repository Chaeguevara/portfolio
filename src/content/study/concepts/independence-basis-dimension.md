---
type: concept
title: Independence, Basis, Dimension
lang: en
pair: "[[independence-basis-dimension.ko]]"
course: "18.06"
lectures: [9]
summary: Independent vectors have only the trivial combination giving 0; a basis is an independent spanning set; its size is the dimension.
tags: [subspaces]
prereqs: [[[vector-space-and-subspace]]]
related: [[[rank]], [[column-space]], [[four-fundamental-subspaces]]]
source: [[[L09-independence-basis-and-dimension]]]
status: draft
---
# Independence, Basis, Dimension

*(한국어: [독립·기저·차원 (Independence, Basis, Dimension)](/portfolio/study/independence-basis-dimension.ko/))*

> Independent vectors have only the trivial combination giving 0; a basis is an independent spanning set; its size is the dimension.

## Idea
Vectors $v_1,\dots,v_k$ are **independent** if $c_1v_1+\dots+c_kv_k=0$ forces all
$c_i=0$. They **span** a space if every vector is some combination of them. A **basis** is
both independent and spanning; the **dimension** is the number of vectors in any basis
(always the same).

## Why it matters
Basis + dimension pin down a subspace exactly, and dimension is what the
[The Four Fundamental Subspaces](/portfolio/study/four-fundamental-subspaces/) theorem counts. Independence of columns $\iff N(A)=\{0\}$
$\iff$ full column [Rank](/portfolio/study/rank/).

## Details
- Any independent set can be extended to a basis; any spanning set can be trimmed to one.
- In $\mathbb{R}^n$ every basis has exactly $n$ vectors.
- For $A$: pivot columns are a basis of $C(A)$; special solutions are a basis of $N(A)$.

## Related
[Rank](/portfolio/study/rank/) · [The Four Fundamental Subspaces](/portfolio/study/four-fundamental-subspaces/) · [Column Space C(A)](/portfolio/study/column-space/)
