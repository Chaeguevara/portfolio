---
type: concept
title: NP-Hardness of Flat Foldability
lang: en
pair: "[[flat-foldability-np-hardness.ko]]"
course: "6.849"
lectures: [7]
summary: Deciding global flat-foldability of a given crease pattern is NP-hard (Bern & Hayes 1996), driven by the layer-ordering constraint.
tags: [origami, flat-folding, complexity, theorem]
prereqs: [[[flat-foldability]]]
related: [[[map-folding]], [[simple-fold]], [[tree-method]]]
source: [[[L07-origami-is-hard]]]
status: draft
---
# NP-Hardness of Flat Foldability

*(한국어: [평평 접힘의 NP-난해성 (NP-Hardness of Flat Foldability)](/portfolio/study/flat-foldability-np-hardness.ko/))*

> Deciding global flat-foldability of a given crease pattern is NP-hard (Bern & Hayes 1996), driven by the layer-ordering constraint.

## Statement
Even though *local* flat-foldability is easy at each vertex, deciding whether a
whole crease pattern has **any** valid flat folded state is **NP-hard** in general
(Bern & Hayes, 1996). The hardness persists even when the
[Mountain–Valley Assignment](/portfolio/study/mountain-valley-assignment/) is given in advance.

## Why it's hard
Each vertex independently can fold flat, but the **layer orderings** chosen at
different vertices must be globally consistent — no paper may pass through paper
anywhere. Reconciling all these local stacking choices simultaneously encodes a
hard combinatorial (NP-complete) constraint-satisfaction problem.

## What the course proves
Lecture 7 gives a practical intro to NP-hardness and reduces known hard problems to
three origami problems:
1. Folding a given CP by a sequence of [Simple Fold](/portfolio/study/simple-fold/)s.
2. Flat folding a given CP using *any* folded state.
3. Optimal [Uniaxial Base](/portfolio/study/uniaxial-base/) design (even when the target tree is a star) — via
   disk packing for the [Tree Method (Origami Design)](/portfolio/study/tree-method/).

## Takeaway
Global origami foldability is fundamentally harder than its local theory; tractable
results (1D, 2×n [Map Folding](/portfolio/study/map-folding/)) are special structured cases.

## Related
[Flat-Foldability](/portfolio/study/flat-foldability/) · [Map Folding](/portfolio/study/map-folding/) · [Simple Fold](/portfolio/study/simple-fold/) · [Tree Method (Origami Design)](/portfolio/study/tree-method/)
