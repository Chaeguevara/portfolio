---
type: concept
title: Rigidity (Generic & Minimal)
lang: en
pair: "[[rigidity.ko]]"
course: "6.849"
lectures: [11]
summary: A framework is rigid if its only motions are trivial (rotations/translations); rigidity theory characterizes which graphs are rigid.
tags: [linkages, rigidity, theorem]
prereqs: [[[linkage]], [[configuration-space]]]
related: [[[laman-theorem]], [[infinitesimal-rigidity]], [[cauchy-rigidity-theorem]], [[rigid-origami]]]
source: [[[L11-rigidity-theory]]]
status: draft
---
# Rigidity (Generic & Minimal)

*(한국어: [강성 (Rigidity)](/portfolio/study/rigidity.ko/))*

> A framework is rigid if its only motions are trivial (rotations/translations); rigidity theory characterizes which graphs are rigid.

## Idea
A bar-joint framework is **rigid** if every motion preserving bar lengths is just a
rigid motion of the whole thing (rotation + translation) — no internal flexing.
Otherwise it is **flexible**. **Rigidity theory** asks which underlying graphs make
a framework rigid, and is the prerequisite for asking whether a linkage can fold at
all.

## Key notions
- **Generic rigidity** — rigidity for "almost all" placements of the vertices, so
  it becomes a *combinatorial* property of the graph (not the exact coordinates).
- **Minimal (generic) rigidity** — rigid, but removing any bar makes it flexible.
- In 2D these are characterized by [Laman's Theorem](/portfolio/study/laman-theorem/); in 3D no good combinatorial
  characterization is known (the "double banana" obstruction).

## Why it matters
Foundational across the course: structural engineering (do buildings/bridges stand
up?), biology (which parts of a folded protein still move), [Rigid Origami](/portfolio/study/rigid-origami/), and
deciding whether linkages move. The convex-polyhedron case is
[Cauchy's Rigidity Theorem](/portfolio/study/cauchy-rigidity-theorem/).

## Related
[Laman's Theorem](/portfolio/study/laman-theorem/) · [Infinitesimal Rigidity](/portfolio/study/infinitesimal-rigidity/) · [Cauchy's Rigidity Theorem](/portfolio/study/cauchy-rigidity-theorem/) · [Tensegrity](/portfolio/study/tensegrity/)
