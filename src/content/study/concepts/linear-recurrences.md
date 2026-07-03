---
type: concept
title: Linear Recurrences
lang: en
pair: "[[linear-recurrences.ko]]"
course: "6.042J"
lectures: [15]
summary: Constant-coefficient recurrences solve via a characteristic equation plus a particular solution.
tags: [recurrences]
prereqs: [[[induction]]]
related: [[[divide-and-conquer-recurrences]], [[generating-functions]]]
source: [[[L15-linear-recurrences]]]
status: draft
---
# Linear Recurrences

*(한국어: [선형 점화식 (Linear Recurrences)](/portfolio/study/linear-recurrences.ko/))*

> Constant-coefficient recurrences solve via a characteristic equation plus a particular solution.

## Idea
For $f(n)=c_1 f(n-1)+\dots+c_d f(n-d)$, guess $f(n)=r^n$ to get the **characteristic
equation** $r^d=c_1 r^{d-1}+\dots+c_d$. Its roots give the homogeneous solution; add a
**particular solution** for any inhomogeneous term.

## Why it matters
Yields closed forms for sequences defined by recursion — Fibonacci, tower-of-Hanoi counts,
population/finance models — so you can evaluate term $n$ without iterating.

## Details
Fibonacci: roots $\varphi=\tfrac{1+\sqrt5}{2}$ and $\hat\varphi$ give
$F_n=\tfrac{\varphi^n-\hat\varphi^n}{\sqrt5}$, so $F_n=\Theta(\varphi^n)$. Repeated roots
contribute terms $n^k r^n$.

## Related
[Divide-and-Conquer Recurrences & Master Theorem](/portfolio/study/divide-and-conquer-recurrences/) · [Generating Functions](/portfolio/study/generating-functions/) · [Mathematical Induction](/portfolio/study/induction/)
