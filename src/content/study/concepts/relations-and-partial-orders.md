---
type: concept
title: Relations & Partial Orders
lang: en
pair: "[[relations-and-partial-orders.ko]]"
course: "6.042J"
lectures: [11]
summary: Binary relations classify by reflexivity/symmetry/transitivity; partial orders model dependency and enable scheduling.
tags: [relations, order]
prereqs: []
related: [[[graphs-basics]]]
source: [[[L11-relations-partial-orders-and-scheduling]]]
status: draft
---
# Relations & Partial Orders

*(한국어: [관계와 부분순서 (Relations & Partial Orders)](/portfolio/study/relations-and-partial-orders.ko/))*

> Binary relations classify by reflexivity/symmetry/transitivity; partial orders model dependency and enable scheduling.

## Idea
A relation $R$ on a set can be reflexive, symmetric, antisymmetric, transitive. An
**equivalence relation** (reflexive+symmetric+transitive) partitions the set into classes. A
**partial order** (reflexive+antisymmetric+transitive) models "comes before / depends on".

## Why it matters
Posets capture task dependencies. A **topological sort** linearizes them into a valid
schedule; **chains** (totally ordered subsets) and **antichains** (mutually incomparable)
bound how much can run in series vs parallel.

## Details
Drawn as a **Hasse diagram**. Dilworth's theorem: the minimum number of chains covering a
poset equals its largest antichain — the parallel-time vs total-work trade-off.

## Related
[Graphs: Walks, Paths & Connectivity](/portfolio/study/graphs-basics/)
