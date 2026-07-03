---
type: concept
title: Set vs Sequence Interfaces
lang: en
pair: "[[data-structure-interfaces.ko]]"
course: "6.006"
lectures: [2]
summary: Separate the operations a data structure must support (interface) from how it does so (implementation).
tags: [data-structures]
prereqs: [[[word-ram-model]]]
related: [[[dynamic-array]], [[hash-table]], [[binary-search-tree]]]
source: [[[L02-data-structures-and-dynamic-arrays]]]
status: draft
---
# Set vs Sequence Interfaces

*(한국어: [집합 대 수열 인터페이스 (Set vs Sequence Interfaces)](/portfolio/study/data-structure-interfaces.ko/))*

> Separate the operations a data structure must support (interface) from how it does so (implementation).

## Idea
Two core interfaces:
- **Sequence:** items in a chosen order; access/insert/delete by **position** (first, last,
  $i$-th).
- **Set:** items with unique keys; **search/insert/delete by key**, plus min/max/successor.
A data structure is a way to implement an interface with certain cost trade-offs.

## Why it matters
Choosing the right interface first, then the structure, is the design discipline of the
course — the same set interface is met by arrays, hash tables, and balanced BSTs with very
different costs.

## Details
Sequence implementations: array (fast index, slow middle-insert), linked list (opposite),
dynamic array (amortized fast append). Set implementations: sorted array, hash table,
balanced BST — each strong on different operations.

## Related
[Dynamic Arrays](/portfolio/study/dynamic-array/) · [Hash Tables (Chaining)](/portfolio/study/hash-table/) · [Binary Search Trees](/portfolio/study/binary-search-tree/)
