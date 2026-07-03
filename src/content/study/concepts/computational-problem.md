---
type: concept
title: Computational Problems & Algorithms
lang: en
pair: "[[computational-problem.ko]]"
course: "6.006"
lectures: [1]
summary: A problem maps inputs to correct outputs; an algorithm is a procedure that solves every instance, proven correct by induction.
tags: [foundations]
prereqs: []
related: [[[asymptotic-notation]], [[word-ram-model]]]
source: [[[L01-algorithms-and-computation]]]
status: draft
---
# Computational Problems & Algorithms

*(한국어: [계산 문제와 알고리즘 (Computational Problems, Algorithms)](/portfolio/study/computational-problem.ko/))*

> A problem maps inputs to correct outputs; an algorithm is a procedure that solves every instance, proven correct by induction.

## Idea
A **computational problem** is a binary relation from inputs to acceptable outputs (often a
function). An **algorithm** is a finite procedure that, for *every* valid input, halts with a
correct output. Correctness is typically proved by induction (on input size or loop
iterations); efficiency by counting operations.

## Why it matters
This is the contract the whole course works against: separate *what* (the problem) from *how*
(the algorithm), so you can compare different algorithms for the same problem.

## Details
A problem can have many algorithms with different costs. "Solving" means correct on all
inputs, not just tested ones — hence proofs. Efficiency is measured asymptotically in the
input size $n$.

## Related
[Asymptotic Notation (Big-O)](/portfolio/study/asymptotic-notation/) · [The Word-RAM Model](/portfolio/study/word-ram-model/)
