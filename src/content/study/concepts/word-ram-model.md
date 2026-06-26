---
type: concept
title: The Word-RAM Model
lang: en
pair: "[[word-ram-model.ko]]"
course: "6.006"
lectures: [1, 2]
summary: "The cost model: memory is words of w bits, and basic operations on a word take O(1) time."
tags: [foundations, models]
prereqs: [[[computational-problem]]]
related: [[[dynamic-array]], [[hash-table]]]
source: [[[L01-algorithms-and-computation]], [[L02-data-structures-and-dynamic-arrays]]]
status: draft
---
The Word-RAM Model

*(한국어: [워드-RAM 모델 (Word-RAM Model)](/portfolio/study/word-ram-model.ko/))*

> The cost model: memory is words of w bits, and basic operations on a word take O(1) time.

## Idea
Memory is an array of **words**, each $w$ bits ($w\ge\log n$ so a word can index the input).
Reading/writing a word at a known address, and arithmetic/comparison/logic on words, each
cost $O(1)$.

## Why it matters
Fixes *what counts as one step*, so running-time claims are precise. It justifies treating
array indexing and integer arithmetic as constant-time, which most algorithm analysis assumes.

## Details
The $w\ge\log n$ assumption is what lets a pointer or index fit in one word. Data structures
are built from words: arrays give $O(1)$ indexing; pointer structures (linked lists, trees)
chase one word per step.

## Related
[Dynamic Arrays](/portfolio/study/dynamic-array/) · [Hash Tables (Chaining)](/portfolio/study/hash-table/) · [Asymptotic Notation (Big-O)](/portfolio/study/asymptotic-notation/)
