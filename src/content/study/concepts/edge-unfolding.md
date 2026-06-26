---
type: concept
title: Edge Unfolding
lang: en
pair: "[[edge-unfolding.ko]]"
course: "6.849"
lectures: [15, 16]
summary: Unfolding where all cuts run along polyhedron edges; existence for all convex polyhedra is a famous open problem.
tags: [polyhedra, complexity]
prereqs: [[[polyhedron-unfolding]]]
related: [[[polyhedron-unfolding]], [[general-unfolding]], [[vertex-unfolding]]]
source: [[[L15-general-edge-unfolding]], [[L16-vertex-orthogonal-unfolding]]]
status: draft
---
# Edge Unfolding

*(한국어: [변 펼치기 (Edge Unfolding)](/portfolio/study/edge-unfolding.ko/))*

> Unfolding where all cuts run along polyhedron edges; existence for all convex polyhedra is a famous open problem.

## Idea
An **edge unfolding** is a [Polyhedron Unfolding](/portfolio/study/polyhedron-unfolding/) in which the cuts are restricted
to the polyhedron's **edges** (you never cut across the interior of a face). The
cut edges form a spanning tree of the polyhedron's edge graph; the remaining edges
become fold lines of the net.

## Why it matters
This is the practical, classic notion (papercraft / Pepakura). The headline
question — **does every convex polyhedron have an edge unfolding?** — has been open
since Dürer (1525) and remains unsolved.

## What's known
- **Convex polyhedra:** unsolved in general; many special classes provably do
  edge-unfold.
- **Nonconvex polyhedra:** can be **edge-ununfoldable** (every edge unfolding
  overlaps). The smallest known example has ~13 faces (conjectured minimal).
- Deciding whether a topologically-convex **orthogonal** polyhedron edge-unfolds is
  **NP-complete**; Pepakura's brute-force heuristics work decently in practice.

## Related
[Polyhedron Unfolding](/portfolio/study/polyhedron-unfolding/) · [General Unfolding (Source & Star)](/portfolio/study/general-unfolding/) · [Vertex Unfolding](/portfolio/study/vertex-unfolding/)
