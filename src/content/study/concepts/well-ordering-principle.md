---
type: concept
title: Well-Ordering Principle
lang: en
pair: "[[well-ordering-principle.ko]]"
course: "6.042J"
lectures: [3]
summary: Every nonempty set of nonnegative integers has a least element — a proof tool equivalent to induction.
tags: [proofs]
prereqs: [[[induction]]]
related: [[[strong-induction]], [[divisibility-and-gcd]]]
source: [[[L03-strong-induction]]]
status: draft
---
# Well-Ordering Principle

*(한국어: [정렬 원리 (Well-Ordering Principle)](/portfolio/study/well-ordering-principle.ko/))*

> Every nonempty set of nonnegative integers has a least element — a proof tool equivalent to induction.

## Idea
If $S\subseteq\mathbb{N}$ and $S\ne\emptyset$, then $S$ has a smallest member. To use it,
assume a counterexample exists, collect all counterexamples into $S$, take the **smallest**
one, and derive a contradiction (usually by producing an even smaller one).

## Why it matters
Often cleaner than induction for "there is no smallest bad case" arguments, and it underlies
the correctness of the Euclidean algorithm and the existence of prime factorizations.

## Details
Example: prove every $n>1$ has a prime divisor. If not, the set of such $n$ has a least
element $m$; $m$ is not prime so $m=ab$ with $1<a<m$, and $a$ has a prime divisor — which
also divides $m$. Contradiction.

## Related
[Mathematical Induction](/portfolio/study/induction/) · [Strong Induction](/portfolio/study/strong-induction/) · [Divisibility, GCD & the Euclidean Algorithm](/portfolio/study/divisibility-and-gcd/)
