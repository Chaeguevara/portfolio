---
type: concept
title: General Unfolding (Source & Star)
lang: en
pair: "[[general-unfolding.ko]]"
course: "6.849"
lectures: [15]
summary: Unfolding with cuts allowed across faces; convex polyhedra always have one via the source or star unfolding.
tags: [polyhedra, algorithms]
prereqs: [[[polyhedron-unfolding]]]
related: [[[polyhedron-unfolding]], [[edge-unfolding]]]
source: [[[L15-general-edge-unfolding]]]
status: draft
---
# General Unfolding (Source & Star)

*(한국어: [일반 펼치기 (General Unfolding: Source & Star)](/portfolio/study/general-unfolding.ko/))*

> Unfolding with cuts allowed across faces; convex polyhedra always have one via the source or star unfolding.

## Idea
A **general unfolding** relaxes [Edge Unfolding](/portfolio/study/edge-unfolding/) by allowing cuts to run **across
the interiors of faces**, not just along edges. With this freedom, *every convex
polyhedron* can be unfolded without overlap — two constructive methods do it.

## The two classic constructions
- **Source unfolding:** pick a source point `x` on the surface; cut along the
  **ridge tree** (the set of points with two or more shortest paths back to `x`).
  What's left unfolds without overlap. Each surface point maps by its geodesic
  distance/direction from `x`.
- **Star unfolding:** instead cut along the **shortest paths from `x` to every
  vertex**. Also provably non-overlapping (a harder proof).

## Why it matters
It cleanly separates two regimes: **general unfolding of convex polyhedra is
solved** (always possible), while **edge** unfolding of convex polyhedra remains
open. Variants include **sun unfolding**, **zipper unfolding** (cuts form a single
path), and **continuous blooming** (unfold by a continuous non-overlapping motion).

## Related
[Polyhedron Unfolding](/portfolio/study/polyhedron-unfolding/) · [Edge Unfolding](/portfolio/study/edge-unfolding/)
