---
type: concept
title: Greedy Algorithms & the Exchange Argument
lang: en
pair: "[[greedy-algorithms.ko]]"
course: "6.046J"
lectures: [2]
summary: Build a solution by locally optimal choices; prove optimality by an exchange argument or matroid structure.
tags: [greedy]
prereqs: []
related: [[[interval-scheduling]], [[minimum-spanning-tree]], [[huffman-coding]]]
source: [[[L02-recap-interval-scheduling]]]
status: draft
---
# Greedy Algorithms & the Exchange Argument

*(한국어: [탐욕 알고리즘과 교환 논증 (Greedy, Exchange Argument)](/portfolio/study/greedy-algorithms.ko/))*

> Build a solution by locally optimal choices; prove optimality by an exchange argument or matroid structure.

## Idea
A **greedy** algorithm makes the choice that looks best right now and never reconsiders. It
works only when local optimality implies global optimality — which must be **proven**, not
assumed.

## Why it matters
When valid, greedy is the simplest and fastest design. The hard part is the correctness proof;
recognizing when greedy fails (and DP is needed) is a core skill.

## Details
The standard proof is the **exchange argument:** take any optimal solution, swap one of its
choices for the greedy choice without making it worse, and repeat until it equals the greedy
solution. The matroid framework characterizes exactly when greedy is optimal.

## Related
[Interval Scheduling](/portfolio/study/interval-scheduling/) · [Minimum Spanning Trees](/portfolio/study/minimum-spanning-tree/) · [Huffman Coding](/portfolio/study/huffman-coding/)
