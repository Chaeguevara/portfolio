---
type: concept
title: Polyhedron Unfolding
lang: en
pair: "[[polyhedron-unfolding.ko]]"
course: "6.849"
lectures: [15]
summary: Cutting a polyhedron's surface so it unfolds flat into one non-overlapping piece (a net).
tags: [polyhedra]
prereqs: []
related: [[[edge-unfolding]], [[general-unfolding]], [[vertex-unfolding]]]
source: [[[L15-general-edge-unfolding]]]
status: draft
---
# Polyhedron Unfolding

*(한국어: [다면체 펼치기 (Polyhedron Unfolding)](/portfolio/study/polyhedron-unfolding.ko/))*

> Cutting a polyhedron's surface so it unfolds flat into one non-overlapping piece (a net).

## Idea
**Unfolding** a polyhedron means cutting its surface along some curves so the
surface opens up into the plane as a single connected, **non-overlapping** flat
piece (a **net**) — which could then be cut from sheet material and folded back up.
Unlike origami, you may **not** cover any part of the surface twice.

## The big open questions
1. Does **every convex polyhedron** have an **[Edge Unfolding](/portfolio/study/edge-unfolding/)** (cuts only along
   edges)? Open since ~1525 (Dürer) — the oldest problem in the field.
2. Does **every polyhedron** (without boundary) have a **[General Unfolding (Source & Star)](/portfolio/study/general-unfolding/)**
   (cuts allowed across faces)? A favorite open problem.

## What's known
- **General unfolding of convex** polyhedra: always possible (source/star
  unfolding).
- **Edge unfolding of general** (nonconvex) polyhedra: can **fail** — there are
  edge-ununfoldable examples; deciding edge-unfoldability of orthogonal polyhedra
  is **NP-complete**.
- Curvature is the key invariant: total angle defect = 4π (Gauss–Bonnet), which is
  why unfoldings can't have holes.

## Related
[Edge Unfolding](/portfolio/study/edge-unfolding/) · [General Unfolding (Source & Star)](/portfolio/study/general-unfolding/) · [Vertex Unfolding](/portfolio/study/vertex-unfolding/)
