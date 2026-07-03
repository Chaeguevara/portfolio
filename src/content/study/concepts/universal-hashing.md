---
type: concept
title: Universal & Perfect Hashing
lang: en
pair: "[[universal-hashing.ko]]"
course: "6.046J"
lectures: [10]
summary: Pick a hash function at random from a universal family so no adversary can force many collisions.
tags: [randomization, hashing]
prereqs: [[[hash-table]]]
related: [[[hash-table]], [[randomized-algorithms]]]
source: [[[L10-hashing-and-amortization]]]
status: draft
---
# Universal & Perfect Hashing

*(한국어: [유니버설·완전 해싱 (Universal & Perfect Hashing)](/portfolio/study/universal-hashing.ko/))*

> Pick a hash function at random from a universal family so no adversary can force many collisions.

## Idea
A **universal family** $\mathcal H$ guarantees that for any two distinct keys,
$\Pr_{h\in\mathcal H}[h(x)=h(y)]\le 1/m$. Choosing $h$ at random *after* the keys are fixed
makes expected collisions small regardless of input.

## Why it matters
Removes the worst-case $O(n)$ of fixed hash functions: no adversary knows your random choice,
so expected $O(1)$ operations hold for *any* input — the rigorous foundation under hash tables.

## Details
Example family: $h_{a,b}(x)=((ax+b)\bmod p)\bmod m$ with random $a,b$ and prime $p$.
**Perfect hashing** uses a two-level universal scheme for a static set, giving worst-case
$O(1)$ lookup with $O(n)$ space.

## Related
[Hash Tables (Chaining)](/portfolio/study/hash-table/) · [Randomized Algorithms](/portfolio/study/randomized-algorithms/)
