---
type: concept
title: Universal Molecule
lang: en
pair: "[[universal-molecule.ko]]"
course: "6.849"
lectures: [4]
summary: An algorithm that fills a convex polygon (from the tree-method packing) with creases that fold it into the required uniaxial flaps.
tags: [origami, design, algorithms]
prereqs: [[[uniaxial-base]], [[tree-method]]]
related: [[[tree-method]], [[uniaxial-base]], [[fold-and-one-cut]]]
source: [[[L04-efficient-origami-design]]]
status: draft
---
# Universal Molecule

*(한국어: [보편 몰리큘 (Universal Molecule)](/portfolio/study/universal-molecule.ko/))*

> An algorithm that fills a convex polygon (from the tree-method packing) with creases that fold it into the required uniaxial flaps.

## Idea
After the [Tree Method (Origami Design)](/portfolio/study/tree-method/) packs circles and rivers into the square, the leftover
regions are convex polygons. The **universal molecule** is Lang's algorithm that
crease-fills each such polygon so it folds flat into the correct part of the
[Uniaxial Base](/portfolio/study/uniaxial-base/). It works by repeatedly insetting the polygon's edges (a
straight-skeleton-like shrink) until they collapse, recording the creases.

## Why it matters
It is the step that guarantees the packed design *actually folds flat* and produces
the desired flaps. Without a molecule to fill the gaps, the packing is only a plan.

## Details
- The inset/shrink process is closely related to the **straight skeleton** used in
  [Fold-and-One-Cut](/portfolio/study/fold-and-one-cut/).
- "Universal" because it works for any convex polygon arising from a valid packing.
- Nonconvex regions need generalizations (part of why Origamizer is more involved).

## Related
[Tree Method (Origami Design)](/portfolio/study/tree-method/) · [Uniaxial Base](/portfolio/study/uniaxial-base/) · [Fold-and-One-Cut](/portfolio/study/fold-and-one-cut/)
