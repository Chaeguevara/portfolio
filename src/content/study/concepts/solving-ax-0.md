---
type: concept
title: "Solving Ax = 0: Pivots, Free Variables, RREF"
lang: en
pair: "[[solving-ax-0.ko]]"
course: "18.06"
lectures: [7]
summary: Reduce A to RREF; pivot columns fix pivot variables, free columns give special solutions spanning the nullspace.
tags: [subspaces, algorithms]
prereqs: [[[gaussian-elimination]], [[nullspace]]]
related: [[[nullspace]], [[complete-solution-ax-b]], [[rank]]]
source: [[[L07-solving-ax-0-pivot-variables-special-solutions]]]
status: draft
---
Solving Ax = 0: Pivots, Free Variables, RREF

*(한국어: [Ax = 0 풀기: 피벗·자유변수·RREF](/portfolio/study/solving-ax-0.ko/))*

> Reduce A to RREF; pivot columns fix pivot variables, free columns give special solutions spanning the nullspace.

## Idea
Row-reduce $A$ to **reduced row echelon form** $R$. Columns with pivots ⇒ **pivot
variables**; columns without ⇒ **free variables**. Setting one free variable to $1$ and the
rest to $0$ (and solving) yields a **special solution**; together they form a basis of the
[Nullspace N(A)](/portfolio/study/nullspace/).

## Why it matters
This is the concrete recipe behind $N(A)$ and the rank–nullity count: with $r$ pivots and
$n$ columns there are $n-r$ free variables, hence $\dim N(A)=n-r$.

## Details
- RREF has 1's in pivot positions and 0's above and below them.
- Number of special solutions = number of free variables = $n-r$.
- Same elimination, extended to $b$, solves $Ax=b$ (see [Complete Solution of Ax = b](/portfolio/study/complete-solution-ax-b/)).

## Related
[Nullspace N(A)](/portfolio/study/nullspace/) · [Rank](/portfolio/study/rank/) · [Complete Solution of Ax = b](/portfolio/study/complete-solution-ax-b/)
