---
type: concept
title: Divide-and-Conquer Recurrences & Master Theorem
lang: en
pair: "[[divide-and-conquer-recurrences.ko]]"
course: "6.042J"
lectures: [14]
summary: Recurrences T(n)=aT(n/b)+f(n) are solved by recursion trees, summarized by the master theorem.
tags: [recurrences, asymptotics]
prereqs: [[[strong-induction]]]
related: [[[linear-recurrences]], [[asymptotics-and-integral-bounds]]]
source: [[[L14-divide-and-conquer-recurrences]]]
status: draft
---
# Divide-and-Conquer Recurrences & Master Theorem

*(한국어: [분할정복 점화식과 마스터 정리](/portfolio/study/divide-and-conquer-recurrences.ko/))*

> Recurrences T(n)=aT(n/b)+f(n) are solved by recursion trees, summarized by the master theorem.

## Idea
A divide-and-conquer algorithm makes $a$ subcalls of size $n/b$ plus $f(n)$ work:
$T(n)=aT(n/b)+f(n)$. A **recursion tree** sums the work per level; whether the top, bottom,
or all levels dominate gives three cases.

## Why it matters
Covers merge sort, binary search, Karatsuba, Strassen, FFT — one theorem reads off the
running time once you know $a$, $b$, and $f$.

## Details
Compare $f(n)$ with $n^{\log_b a}$: if $f$ is polynomially smaller, $T=\Theta(n^{\log_b a})$;
if equal (up to a log), $T=\Theta(n^{\log_b a}\log n)$; if larger (and regular),
$T=\Theta(f(n))$. Merge sort: $a=b=2,f=n\Rightarrow \Theta(n\log n)$.

## Related
[Linear Recurrences](/portfolio/study/linear-recurrences/) · [Strong Induction](/portfolio/study/strong-induction/) · [Asymptotics & Integral Bounds](/portfolio/study/asymptotics-and-integral-bounds/)
