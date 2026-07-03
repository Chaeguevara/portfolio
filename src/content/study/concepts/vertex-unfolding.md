---
type: concept
title: Vertex Unfolding
lang: en
pair: "[[vertex-unfolding.ko]]"
course: "6.849"
lectures: [16]
summary: A relaxed unfolding where pieces may stay connected only at single vertices (like a hinged chain of faces).
tags: [polyhedra]
prereqs: [[[edge-unfolding]]]
related: [[[edge-unfolding]], [[hinged-dissection]]]
source: [[[L16-vertex-orthogonal-unfolding]]]
status: draft
---
# Vertex Unfolding

*(한국어: [꼭짓점 펼치기 (Vertex Unfolding)](/portfolio/study/vertex-unfolding.ko/))*

> A relaxed unfolding where pieces may stay connected only at single vertices (like a hinged chain of faces).

## Idea
A **vertex unfolding** loosens [Edge Unfolding](/portfolio/study/edge-unfolding/): the unfolded faces need only be
connected through shared **vertices** (point connections), not full edges — much
like a [Hinged Dissection](/portfolio/study/hinged-dissection/) of the surface. The result is a connected, non-
overlapping planar layout where consecutive faces touch at a point.

## Why it matters
It sits between edge unfolding (often impossible) and general unfolding (cuts
anywhere). It gives a **positive** existence result where edge unfolding fails:

- **Every polyhedron with triangular faces has a vertex unfolding** — even nonconvex
  ones.
- But there is a **topologically convex polyhedron with no vertex unfolding** (Abel
  & Demaine 2011), so it is not universal.

## Details
- Vertex unfoldings are typically "linear" (faces strung in a path/facet path) and
  may revisit vertices.
- Related orthogonal-polyhedron results: general unfolding with only **quadratic**
  refinement (Damian, Demaine, Flatland 2012), via grid/Manhattan-tower structure.

## Related
[Edge Unfolding](/portfolio/study/edge-unfolding/) · [Hinged Dissection](/portfolio/study/hinged-dissection/)
