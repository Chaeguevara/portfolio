---
type: concept
title: Interval Scheduling
lang: en
pair: "[[interval-scheduling.ko]]"
course: "6.046J"
lectures: [2]
summary: Select the most non-overlapping intervals by repeatedly taking the one that finishes earliest.
tags: [greedy]
prereqs: [[[greedy-algorithms]]]
related: [[[greedy-algorithms]]]
source: [[[L02-recap-interval-scheduling]]]
status: draft
---
# Interval Scheduling

*(한국어: [구간 스케줄링 (Interval Scheduling)](/portfolio/study/interval-scheduling.ko/))*

> Select the most non-overlapping intervals by repeatedly taking the one that finishes earliest.

## Idea
Given intervals with start/finish times, pick a maximum set of mutually non-overlapping ones.
The greedy rule: always take the interval with the **earliest finish time** among those still
compatible, then discard everything it overlaps.

## Why it matters
The textbook example of a correct greedy algorithm — room/CPU/meeting scheduling — and a clean
target for the exchange-argument proof.

## Details
Sort by finish time ($O(n\log n)$), then one linear pass. Exchange argument: the earliest
finisher leaves the most room, so some optimal solution contains it; induct on the rest.
Earliest-start or shortest-interval rules both fail.

## Related
[Greedy Algorithms & the Exchange Argument](/portfolio/study/greedy-algorithms/)
