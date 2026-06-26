---
type: concept
title: Computational Geometry
lang: en
pair: "[[computational-geometry.ko]]"
course: "6.046J"
lectures: [23]
summary: "Algorithms for geometric objects: sweep lines for intersections, convex hull, and closest pair."
tags: [geometry]
prereqs: [[[comparison-sorting]]]
related: [[[clustering]]]
source: [[[L23-computational-geometry]]]
status: draft
---
Computational Geometry

*(한국어: [계산 기하 (Computational Geometry)](/portfolio/study/computational-geometry.ko/))*

> Algorithms for geometric objects: sweep lines for intersections, convex hull, and closest pair.

## Idea
Geometry problems exploit spatial order. The **sweep-line** technique moves a line across the
plane, processing events (endpoints, crossings) in sorted order and maintaining a status
structure of what the line currently touches.

## Why it matters
Underlies graphics, GIS, robotics, and CAD. The paradigms (sweep, divide-and-conquer on
coordinates) recur across geometric algorithms.

## Details
**Segment intersection:** sweep left-to-right, $O((n+k)\log n)$ for $k$ crossings. **Convex
hull:** Graham scan / Andrew's monotone chain in $O(n\log n)$. **Closest pair:**
divide-and-conquer in $O(n\log n)$, checking only a thin strip across the split.

## Related
[Clustering](/portfolio/study/clustering/) · [Comparison Sorting & Its Lower Bound](/portfolio/study/comparison-sorting/)
