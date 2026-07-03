---
type: concept
title: Asymptotic Notation (Big-O)
lang: en
pair: "[[asymptotic-notation.ko]]"
course: "6.006"
lectures: [1, 19]
summary: O, Omega, Theta describe how running time grows with input size, hiding constants and lower-order terms.
tags: [foundations, asymptotics]
prereqs: [[[computational-problem]]]
related: [[[word-ram-model]], [[asymptotics-and-integral-bounds]]]
source: [[[L01-algorithms-and-computation]], [[L19-complexity]]]
status: draft
---
# Asymptotic Notation (Big-O)

*(한국어: [점근 표기법 (Big-O)](/portfolio/study/asymptotic-notation.ko/))*

> O, Omega, Theta describe how running time grows with input size, hiding constants and lower-order terms.

## Idea
$f=O(g)$: $f$ grows at most like $g$ (upper bound); $\Omega$: lower bound; $\Theta$: both, a
tight bound. Constants and low-order terms drop, so $3n^2+5n=\Theta(n^2)$.

## Why it matters
Makes algorithm comparison machine-independent: $\Theta(n\log n)$ beats $\Theta(n^2)$ for
large $n$ regardless of constants, which is the whole point of asymptotic analysis.

## Details
Common classes, slowest-growing first: constant $\Theta(1)$, log $\Theta(\log n)$, linear
$\Theta(n)$, $\Theta(n\log n)$, quadratic $\Theta(n^2)$, polynomial $\Theta(n^c)$,
exponential $\Theta(2^n)$. Used to state both running time and space.

## Related
[The Word-RAM Model](/portfolio/study/word-ram-model/) · [Asymptotics & Integral Bounds](/portfolio/study/asymptotics-and-integral-bounds/) · [Computational Problems & Algorithms](/portfolio/study/computational-problem/)
