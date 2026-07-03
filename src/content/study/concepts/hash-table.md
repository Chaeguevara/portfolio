---
type: concept
title: Hash Tables (Chaining)
lang: en
pair: "[[hash-table.ko]]"
course: "6.006"
lectures: [4]
summary: Store keys in buckets chosen by a hash function; with a good hash, search/insert/delete are O(1) expected.
tags: [data-structures, hashing]
prereqs: [[[data-structure-interfaces]]]
related: [[[universal-hashing]], [[linear-sorting]]]
source: [[[L04-hashing]]]
status: draft
---
# Hash Tables (Chaining)

*(한국어: [해시 테이블 (체이닝) (Hash Tables, Chaining)](/portfolio/study/hash-table.ko/))*

> Store keys in buckets chosen by a hash function; with a good hash, search/insert/delete are O(1) expected.

## Idea
A hash function $h$ maps a key to a bucket index $h(k)\in\{0,\dots,m-1\}$. **Chaining** keeps
a linked list per bucket for collisions. With $n$ keys in $m\approx n$ buckets and a hash
that spreads keys evenly, each operation is $O(1)$ **expected**.

## Why it matters
The fastest general set/dictionary — $O(1)$ expected lookup beats the $O(\log n)$ of balanced
trees — used everywhere keys need not be kept in order.

## Details
The load factor $\alpha=n/m$ controls chain length; resize (like a dynamic array) to keep
$\alpha=O(1)$. Worst case is $O(n)$ if all keys collide, which **universal hashing** makes
improbable by choosing $h$ at random.

## Related
[Universal & Perfect Hashing](/portfolio/study/universal-hashing/) · [Set vs Sequence Interfaces](/portfolio/study/data-structure-interfaces/) · [Linear-Time Sorting (Counting & Radix)](/portfolio/study/linear-sorting/)
