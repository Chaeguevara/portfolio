---
type: concept
title: Pointed Pseudotriangulation
lang: en
pair: "[[pseudotriangulation.ko]]"
course: "6.849"
lectures: [13]
summary: A planar subdivision into pseudotriangles (3 convex corners) with every vertex pointed; its mechanics drive the carpenter's-rule unfolding.
tags: [linkages, geometry, algorithms]
prereqs: [[[carpenters-rule-theorem]], [[rigidity]]]
related: [[[carpenters-rule-theorem]], [[locked-linkage]], [[rigidity]]]
source: [[[L13-locked-linkages]]]
status: draft
---
# Pointed Pseudotriangulation

*(한국어: [뾰족 유사삼각분할 (Pointed Pseudotriangulation)](/portfolio/study/pseudotriangulation.ko/))*

> A planar subdivision into pseudotriangles (3 convex corners) with every vertex pointed; its mechanics drive the carpenter's-rule unfolding.

## Idea
A **pseudotriangle** is a polygon with exactly three convex (interior < 180°)
corners; the rest are reflex. A **pointed pseudotriangulation** subdivides a point
set/polygon into pseudotriangles so that every vertex is **pointed** (its incident
edges fit within some half-plane, i.e. it has a reflex "gap"). These are minimally
rigid frameworks with especially nice motion properties.

## Why it matters
They are the engine behind a proof/algorithm of the [Carpenter's Rule Theorem](/portfolio/study/carpenters-rule-theorem/):
removing one convex-hull edge yields a mechanism with exactly one degree of
freedom, and that motion is **expansive** — so it unfolds the chain without
self-crossing. The expansive motions of a chain are exactly the "extreme rays" of
the cone of all expansive motions, which pointed pseudotriangulations realize.

## Details
- They have a *fixed* number of edges/faces (unlike triangulations), and are
  minimally generically [rigid](/portfolio/study/rigidity/).
- Every planar minimally generically rigid graph can be drawn as a pointed
  pseudotriangulation (a universality result).
- Originally introduced for polygon ray-shooting data structures.

## Related
[Carpenter's Rule Theorem](/portfolio/study/carpenters-rule-theorem/) · [Locked Linkage](/portfolio/study/locked-linkage/) · [Rigidity (Generic & Minimal)](/portfolio/study/rigidity/)
