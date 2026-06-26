---
type: concept
title: Simple Fold
lang: en
pair: "[[simple-fold.ko]]"
course: "6.849"
lectures: [2]
summary: Folding all layers along one straight line by ±180°; the most restrictive, manufacturing-friendly fold model.
tags: [origami, flat-folding, algorithms]
prereqs: [[[crease-pattern]]]
related: [[[map-folding]], [[flat-foldability]], [[flat-foldability-np-hardness]]]
source: [[[L02-simple-folds]]]
status: draft
---
# Simple Fold

*(한국어: [단순 접기 (Simple Fold)](/portfolio/study/simple-fold.ko/))*

> Folding all layers along one straight line by ±180°; the most restrictive, manufacturing-friendly fold model.

## Idea
A **simple fold** picks one straight line spanning the current (possibly already
folded) stack and folds everything along it by exactly ±180°. A *simple folding*
is a sequence of such folds. This is the kind of fold a machine (metal/wood/plastic
brake press) can perform, which is why it is studied separately.

## Why it matters
Simple folds are the warm-up before general "fold many creases at once" origami.
Surprisingly, they are already enough to fold **any 2D shape** (silhouette), and
with slightly more general folds, any 3D shape — yet deciding simple-foldability of
a given CP can still be **NP-hard** ([NP-Hardness of Flat Foldability](/portfolio/study/flat-foldability-np-hardness/)).

## Details
- **1D simple foldability** (parallel creases on a strip) is decidable in **linear
  time** — a clean algorithm shown in class, simpler than the textbook's.
- **2D map folding** with simple folds (the n×n grid) is the classic case; 2×n is
  polynomial, general m×n remains hard/open ([Map Folding](/portfolio/study/map-folding/)).
- Variants differ by how many layers a fold may cross (all-layers, some-layers).

## Related
[Map Folding](/portfolio/study/map-folding/) · [Flat-Foldability](/portfolio/study/flat-foldability/) · [NP-Hardness of Flat Foldability](/portfolio/study/flat-foldability-np-hardness/)
