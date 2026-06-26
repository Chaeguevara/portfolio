---
type: concept
title: "Complexity Classes: P, NP, EXP"
lang: en
pair: "[[complexity-classes.ko]]"
course: "6.006"
lectures: [19]
summary: Classify problems by the resources to solve or verify them; P is efficiently solvable, NP efficiently verifiable.
tags: [complexity]
prereqs: [[[asymptotic-notation]]]
related: [[[np-completeness]], [[pseudopolynomial]]]
source: [[[L19-complexity]]]
status: draft
---
Complexity Classes: P, NP, EXP

*(한국어: [복잡도 클래스: P, NP, EXP (Complexity Classes)](/portfolio/study/complexity-classes.ko/))*

> Classify problems by the resources to solve or verify them; P is efficiently solvable, NP efficiently verifiable.

## Idea
- **P:** decision problems solvable in polynomial time.
- **NP:** problems whose "yes" answers have a polynomial-time-**checkable** certificate.
- **EXP:** solvable in exponential time.
$\text{P}\subseteq\text{NP}\subseteq\text{EXP}$. Whether $\text{P}=\text{NP}$ is the famous
open question.

## Why it matters
Tells you when to stop hunting for a fast exact algorithm. If a problem is NP-hard, a
polynomial algorithm would solve all of NP — so you turn to approximation, heuristics, or
special cases.

## Details
A problem is **NP-hard** if everything in NP reduces to it, and **NP-complete** if it is also
in NP. Reductions transfer hardness. Some problems are even harder (undecidable, like the
halting problem).

## Related
[NP-Completeness & Reductions](/portfolio/study/np-completeness/) · [Pseudopolynomial Time & Subset Sum](/portfolio/study/pseudopolynomial/) · [Asymptotic Notation (Big-O)](/portfolio/study/asymptotic-notation/)
