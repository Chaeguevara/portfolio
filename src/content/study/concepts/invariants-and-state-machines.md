---
type: concept
title: Invariants & State Machines
lang: en
pair: "[[invariants-and-state-machines.ko]]"
course: "6.042J"
lectures: [3]
summary: Model a process as states with transitions; a preserved invariant proves what the process can and cannot reach.
tags: [proofs, invariants]
prereqs: [[[induction]]]
related: [[[strong-induction]]]
source: [[[L03-strong-induction]]]
status: draft
---
# Invariants & State Machines

*(한국어: [불변량과 상태 기계 (Invariants & State Machines)](/portfolio/study/invariants-and-state-machines.ko/))*

> Model a process as states with transitions; a preserved invariant proves what the process can and cannot reach.

## Idea
A **state machine** has a start state and transition rules. An **invariant** is a property
true at the start and **preserved by every transition** — so it holds in every reachable
state (this is induction on the number of steps).

## Why it matters
The standard tool for proving an algorithm or process *cannot* reach a bad state: if no
reachable state satisfies "done wrong", the process is correct.

## Details
Classic puzzles: the 15-puzzle solvability (parity invariant), a robot on a grid that only
moves diagonally (stays on one color), chips/coins games. Loop invariants in program
correctness are the same idea.

## Related
[Mathematical Induction](/portfolio/study/induction/) · [Strong Induction](/portfolio/study/strong-induction/)
