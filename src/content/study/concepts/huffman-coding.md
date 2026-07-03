---
type: concept
title: Huffman Coding
lang: en
pair: "[[huffman-coding.ko]]"
course: "6.046J"
lectures: [19]
summary: Build an optimal prefix-free code greedily by repeatedly merging the two least-frequent symbols.
tags: [greedy, compression]
prereqs: [[[greedy-algorithms]]]
related: [[[greedy-algorithms]], [[binary-heap]]]
source: [[[L19-compression-and-huffman-coding]]]
status: draft
---
# Huffman Coding

*(한국어: [허프만 코딩 (Huffman Coding)](/portfolio/study/huffman-coding.ko/))*

> Build an optimal prefix-free code greedily by repeatedly merging the two least-frequent symbols.

## Idea
A **prefix-free code** assigns each symbol a bit string where none is a prefix of another, so
decoding is unambiguous. **Huffman** repeatedly merges the two lowest-frequency nodes into a
parent, building a binary tree whose leaves are symbols; the path gives each code.

## Why it matters
Produces a provably **optimal** symbol code (minimum expected length) — the basis of file
compression (ZIP, JPEG, MP3 entropy stages).

## Details
Use a min-heap to pull the two rarest nodes; $n$ merges give $O(n\log n)$. Optimality is an
exchange argument: the two rarest symbols can be made deepest siblings. Expected length
approaches the **entropy** lower bound.

## Related
[Greedy Algorithms & the Exchange Argument](/portfolio/study/greedy-algorithms/) · [Binary Heaps & Priority Queues](/portfolio/study/binary-heap/)
