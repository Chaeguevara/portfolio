---
type: concept
title: Pigeonhole Principle
lang: en
pair: "[[pigeonhole-principle.ko]]"
course: "6.042J"
lectures: [17]
summary: If n+1 items go into n boxes, some box holds two — a simple counting fact with surprising consequences.
tags: [counting]
prereqs: [[[counting-principles]]]
related: [[[inclusion-exclusion]]]
source: [[[L17-counting-rules-ii]]]
status: draft
---
# Pigeonhole Principle

*(한국어: [비둘기집 원리 (Pigeonhole Principle)](/portfolio/study/pigeonhole-principle.ko/))*

> If n+1 items go into n boxes, some box holds two — a simple counting fact with surprising consequences.

## Idea
Put $n+1$ pigeons in $n$ holes: at least one hole has $\ge 2$. Generalized: $kn+1$ items in
$n$ boxes force some box to hold $\ge k+1$.

## Why it matters
Proves *existence* without construction. Two people in a large city share a hair count; any
6 people contain 3 mutual friends or 3 mutual strangers (Ramsey); a sequence has a long
monotone subsequence.

## Details
The art is choosing the pigeons and holes. Example: among any $n+1$ numbers from
$\{1,\dots,2n\}$, two are coprime (consecutive) — pair them into $n$ boxes.

## Related
[Counting: Sum, Product & Bijections](/portfolio/study/counting-principles/) · [Inclusion–Exclusion](/portfolio/study/inclusion-exclusion/)
