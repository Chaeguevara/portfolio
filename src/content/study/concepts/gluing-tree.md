---
type: concept
title: Gluing Tree
lang: en
pair: "[[gluing-tree.ko]]"
course: "6.849"
lectures: [17, 18]
summary: A combinatorial description of how a polygon's boundary is glued to itself; the search structure for finding Alexandrov gluings.
tags: [polyhedra, algorithms]
prereqs: [[[alexandrov-theorem]]]
related: [[[alexandrov-theorem]], [[d-form]]]
source: [[[L17-alexandrov-s-theorem]], [[L18-gluing-algorithms]]]
status: draft
---
# Gluing Tree

*(한국어: [붙이기 트리 (Gluing Tree)](/portfolio/study/gluing-tree.ko/))*

> A combinatorial description of how a polygon's boundary is glued to itself; the search structure for finding Alexandrov gluings.

## Idea
When folding a polygon into a polyhedron, the polygon's **perimeter is glued to
itself**. A **gluing tree** captures which boundary points are identified with which
— the "seam" structure of the gluing — as a tree. It is the data structure that
makes searching for valid **Alexandrov gluings** ([Alexandrov's Theorem](/portfolio/study/alexandrov-theorem/)) tractable.

## Why it matters
[Alexandrov's Theorem](/portfolio/study/alexandrov-theorem/) guarantees a unique polyhedron *once you have a valid
gluing*, but finding gluings is the algorithmic challenge. Gluing trees let you
enumerate and count them, and bound how many exist.

## Results
- **Perimeter halving** is the simplest gluing of a convex polygon (fold the
  boundary onto itself at two antipodal points).
- **Edge-to-edge** gluings: a polynomial-time **dynamic program** decides/enumerates
  them; the number can be exponential in general, but polynomial for polygons of
  bounded "sharpness".
- **Rolling belts** are the mechanism by which a polygon can have infinitely many
  gluings (a band that can slide).
- Case studies: the Latin cross folds to many distinct convex polyhedra.

## Related
[Alexandrov's Theorem](/portfolio/study/alexandrov-theorem/) · [D-Form](/portfolio/study/d-form/)
