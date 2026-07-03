---
type: concept
title: Approximation Algorithms
lang: en
pair: "[[approximation-algorithms.ko]]"
course: "6.046J"
lectures: [18]
summary: For NP-hard optimization, find a provably near-optimal solution in polynomial time with a guaranteed ratio.
tags: [complexity, approximation]
prereqs: [[[np-completeness]]]
related: [[[np-completeness]], [[clustering]], [[derandomization]]]
source: [[[L18-polynomial-time-approximations]]]
status: draft
---
# Approximation Algorithms

*(한국어: [근사 알고리즘 (Approximation Algorithms)](/portfolio/study/approximation-algorithms.ko/))*

> For NP-hard optimization, find a provably near-optimal solution in polynomial time with a guaranteed ratio.

## Idea
When exact solving is intractable, an **$\alpha$-approximation** runs in polynomial time and
returns a solution within factor $\alpha$ of optimal on *every* input — a worst-case quality
guarantee, not a heuristic hope.

## Why it matters
The principled response to NP-hardness: trade exactness for a proven bound. The art is
designing the algorithm *and* the bound, often by comparing against a relaxation or lower
bound on the optimum.

## Details
**Vertex cover:** taking both endpoints of a maximal matching is a $2$-approximation.
**Set cover:** greedy gives $\ln n$. Some problems admit a **PTAS** (any $1+\epsilon$);
others are hard to approximate beyond a threshold unless P$=$NP.

## Related
[NP-Completeness & Reductions](/portfolio/study/np-completeness/) · [Clustering](/portfolio/study/clustering/) · [Derandomization](/portfolio/study/derandomization/)
