---
type: concept
title: Crease Pattern Import Pipeline
lang: en
pair: "[[crease-pattern-import-pipeline.ko]]"
summary: Recovering a fold graph from loose drawing geometry — merge endpoints, split crossings and T-junctions, prune, trace planar faces, triangulate.
tags: [origami, implementation, computational-geometry]
prereqs: [[[svg-crease-pattern-format]]]
related: [[[compliant-fold-simulation]], [[crease-pattern]]]
source: []
status: draft
---
# Crease Pattern Import Pipeline

*(한국어: [크리스 패턴 임포트 파이프라인](/portfolio/study/crease-pattern-import-pipeline.ko/))*

> Recovering a fold graph from loose drawing geometry — merge endpoints, split
> crossings and T-junctions, prune, trace planar faces, triangulate.

## Idea
A drawn crease pattern is a bag of line segments, not a graph. The importer
(ported in `src/app/fold/svgImport.ts`) rebuilds topology in a fixed order:
1. merge endpoints within a tolerance (spatial hash),
2. drop loops/duplicates,
3. split edges at proper crossings *and* T-junctions (an endpoint lying on
   another edge's interior — the common case for creases meeting a border),
4. merge colinear degree-2 vertices, drop stray ones,
5. sort each vertex's neighbors by angle and trace planar faces,
6. triangulate (quads by shorter diagonal, n-gons by earcut) — every new
   diagonal becomes a facet ("F") edge with target angle 0.

## Why it matters
Every downstream guarantee — faces that close up, hinges with exactly two
adjacent triangles, a solvable spring network — depends on this cleanup. Most
import failures are topology failures here, not physics failures later.

## Details
- Face tracing walks each directed edge once, taking the next-clockwise
  neighbor at every step; interior faces all come out with one orientation and
  the unbounded outer face with the other, which is how it's discarded.
- Tolerance matters twice: endpoint merging *and* deciding whether an
  intersection is "at" an endpoint (T-junction) or interior (proper crossing).
- Faces bounded entirely by border edges are holes, not paper.

## Related
[SVG Crease Pattern Format](/portfolio/study/svg-crease-pattern-format/) · [Compliant Fold Simulation](/portfolio/study/compliant-fold-simulation/)
