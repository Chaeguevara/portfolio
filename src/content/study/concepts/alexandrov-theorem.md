---
type: concept
title: Alexandrov's Theorem
lang: en
pair: "[[alexandrov-theorem.ko]]"
course: "6.849"
lectures: [16, 17, 18]
summary: Any convex polyhedral metric on a sphere is realized by a unique convex polyhedron — so a valid gluing of a polygon folds to exactly one convex solid.
tags: [polyhedra, theorem, algorithms]
prereqs: [[[cauchy-rigidity-theorem]], [[gluing-tree]]]
related: [[[cauchy-rigidity-theorem]], [[gluing-tree]], [[d-form]]]
source: [[[L16-vertex-orthogonal-unfolding]], [[L17-alexandrov-s-theorem]], [[L18-gluing-algorithms]]]
status: draft
---
# Alexandrov's Theorem

*(한국어: [알렉산드로프 정리 (Alexandrov's Theorem)](/portfolio/study/alexandrov-theorem.ko/))*

> Any convex polyhedral metric on a sphere is realized by a unique convex polyhedron — so a valid gluing of a polygon folds to exactly one convex solid.

## Statement
**Alexandrov's Theorem (1941):** every **convex polyhedral metric** on a topological
sphere (a way of measuring distance that is locally flat except at finitely many
cone points, each with angle ≤ 2π, total curvature 4π) is the surface metric of a
**unique** convex polyhedron. Existence is Alexandrov; uniqueness is
[Cauchy's Rigidity Theorem](/portfolio/study/cauchy-rigidity-theorem/).

## Why it matters
It is the master tool for **folding polygons into polyhedra**: glue up the boundary
of a flat polygon so that no point has more than 2π of material around it
(an **Alexandrov gluing**), and the theorem guarantees there is exactly one convex
polyhedron with that surface — though it doesn't tell you its shape directly.

## From theorem to algorithm
- Alexandrov's original proof is non-constructive; **Bobenko–Izmestiev** gives a
  constructive proof, leading to a **pseudopolynomial** algorithm to compute the
  polyhedron.
- Finding valid gluings uses the [Gluing Tree](/portfolio/study/gluing-tree/); some polygons have none, convex
  polygons always have at least one, and "rolling belts" produce infinite families.

## Applications
- **[D-Form](/portfolio/study/d-form/)s**, pita forms, seam forms (gluing convex shapes).
- Case studies: folding the Latin cross, equilateral triangle, square into the many
  convex polyhedra each admits.

## Related
[Cauchy's Rigidity Theorem](/portfolio/study/cauchy-rigidity-theorem/) · [Gluing Tree](/portfolio/study/gluing-tree/) · [D-Form](/portfolio/study/d-form/)
