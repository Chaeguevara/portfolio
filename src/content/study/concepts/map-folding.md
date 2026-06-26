---
type: concept
title: Map Folding
lang: en
pair: "[[map-folding.ko]]"
course: "6.849"
lectures: [2, 7]
summary: Given an m×n grid of creases with M/V labels, decide if it folds flat into a unit stack — easy in 1D, open/hard in general 2D.
tags: [origami, flat-folding, algorithms, complexity]
prereqs: [[[simple-fold]], [[flat-foldability]]]
related: [[[flat-foldability-np-hardness]], [[simple-fold]]]
source: [[[L02-simple-folds]], [[L07-origami-is-hard]]]
status: draft
---
# Map Folding

*(한국어: [지도 접기 (Map Folding)](/portfolio/study/map-folding.ko/))*

> Given an m×n grid of creases with M/V labels, decide if it folds flat into a unit stack — easy in 1D, open/hard in general 2D.

## Idea
The classic **map-folding** problem: a rectangular map is pre-creased on a grid,
each crease marked mountain or valley; can you fold it flat along all creases into
a single stacked unit square? It is the cleanest testbed for flat-foldability
because the crease geometry is fixed and only the layer ordering is in question.

## Status (what's known)
- **1D** (a strip, parallel creases): linear-time decidable.
- **2 × n** maps: polynomial-time (a result highlighted in the course).
- **General m × n** maps: the complexity is a long-standing **open** problem; with
  general (non-simple) folds it relates to the [hardness](/portfolio/study/flat-foldability-np-hardness/)
  of flat foldability.

## Why it matters
Map folding sits exactly at the boundary between the *easy* 1D theory and the *hard*
general theory. It also models real engineering: folding maps, airbags, and sheet
material compactly.

## Related
[Simple Fold](/portfolio/study/simple-fold/) · [Flat-Foldability](/portfolio/study/flat-foldability/) · [NP-Hardness of Flat Foldability](/portfolio/study/flat-foldability-np-hardness/)
