---
type: concept
title: Fold-and-One-Cut
lang: en
pair: "[[fold-and-one-cut.ko]]"
course: "6.849"
lectures: [8]
summary: Fold a sheet flat so that a single straight cut produces any desired arrangement of polygons / line drawing.
tags: [origami, design, algorithms]
prereqs: [[[crease-pattern]]]
related: [[[universal-molecule]], [[tree-method]]]
source: [[[L08-fold-one-cut]]]
status: draft
---
# Fold-and-One-Cut

*(한국어: [접고 한 번 자르기 (Fold-and-One-Cut)](/portfolio/study/fold-and-one-cut.ko/))*

> Fold a sheet flat so that a single straight cut produces any desired arrangement of polygons / line drawing.

## Idea
The **fold-and-one-cut theorem**: any set of straight-line segments (e.g. the
edges of any collection of polygons, or letters of the alphabet) can be made by
folding the paper flat and making **one complete straight cut**. The folding lines
up all the desired cut segments onto a single line.

## Why it matters
A century-spanning puzzle (back to the 1700s; a famous Houdini trick) turned into a
theorem and algorithm — Demaine's first work in computational origami. It connects
to airbag **flattening** and to the design machinery of the [Tree Method (Origami Design)](/portfolio/study/tree-method/).

## Two methods
1. **Straight-skeleton method** — generalizes the [Universal Molecule](/portfolio/study/universal-molecule/) to
   nonconvex polygons; aligns cut edges via the straight skeleton. Loses control of
   the "shadow tree".
2. **Disk-packing method** — packs disks (no rivers) and uses universal molecules
   for triangles/quadrangles.

## Details
- Mathematical cuts allow odd-degree vertices; real scissor cuts usually need two
  passes to simulate them.
- Recent offshoot: what shapes are achievable with only [Simple Fold](/portfolio/study/simple-fold/)s?

## Related
[Universal Molecule](/portfolio/study/universal-molecule/) · [Tree Method (Origami Design)](/portfolio/study/tree-method/) · [Simple Fold](/portfolio/study/simple-fold/)
