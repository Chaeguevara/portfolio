---
type: concept
title: van Emde Boas Trees
lang: en
pair: "[[van-emde-boas.ko]]"
course: "6.046J"
lectures: [15]
summary: A recursive structure over a universe of size u giving predecessor/successor in O(log log u).
tags: [data-structures]
prereqs: [[[binary-search-tree]]]
related: [[[binary-search-tree]]]
source: [[[L15-van-emde-boas-data-structure]]]
status: draft
---
# van Emde Boas Trees

*(한국어: [판 엠더 보아스 트리 (van Emde Boas Trees)](/portfolio/study/van-emde-boas.ko/))*

> A recursive structure over a universe of size u giving predecessor/successor in O(log log u).

## Idea
For integer keys in $\{0,\dots,u-1\}$, a **vEB tree** splits the universe into $\sqrt u$
clusters of size $\sqrt u$, with a summary structure over which clusters are nonempty. Each
operation recurses into one $\sqrt u$-size substructure.

## Why it matters
Beats comparison-based $O(\log n)$ for ordered operations on bounded integer keys —
insert, delete, member, **predecessor/successor** — when the universe is known.

## Details
The recurrence $T(u)=T(\sqrt u)+O(1)$ solves to $O(\log\log u)$. It stores min/max specially
to avoid extra recursion. Space is $O(u)$ (reducible to $O(n)$ with hashing). Trades generality
for speed on integer keys.

## Related
[Binary Search Trees](/portfolio/study/binary-search-tree/)
