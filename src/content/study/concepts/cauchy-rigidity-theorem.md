---
type: concept
title: Cauchy's Rigidity Theorem
lang: en
pair: "[[cauchy-rigidity-theorem.ko]]"
course: "6.849"
lectures: [16]
summary: A convex polyhedron is uniquely determined (up to congruence) by its faces and how they're glued — convex polyhedra are rigid.
tags: [polyhedra, rigidity, theorem]
prereqs: [[[rigidity]]]
related: [[[rigidity]], [[alexandrov-theorem]]]
source: [[[L16-vertex-orthogonal-unfolding]]]
status: draft
---
# Cauchy's Rigidity Theorem

*(한국어: [코시 강성 정리 (Cauchy's Rigidity Theorem)](/portfolio/study/cauchy-rigidity-theorem.ko/))*

> A convex polyhedron is uniquely determined (up to congruence) by its faces and how they're glued — convex polyhedra are rigid.

## Statement
**Cauchy's Rigidity Theorem (1813):** if two **convex** polyhedra have congruent
corresponding faces glued in the same combinatorial pattern, then the polyhedra are
themselves congruent. Treating faces as rigid plates and edges as hinges, a convex
polyhedron has **exactly one** convex realization — it cannot flex.

## Why it matters
It is the foundational rigidity fact for 3D convex shapes and the prerequisite for
**folding** polygons into polyhedra: it guarantees uniqueness, which
[Alexandrov's Theorem](/portfolio/study/alexandrov-theorem/) then upgrades to existence.

## Proof idea
Suppose two such polyhedra differ. Mark each edge where the dihedral angle is larger
(+) or smaller (−) than its counterpart. A combinatorial lemma bounds the sign
changes around each vertex; a global count (using Euler's formula on the sphere)
shows the signs can't be consistently distributed — contradiction.

## Caveats / extensions
- **Convexity is essential** — *nonconvex* polyhedra can flex (Connelly's flexible
  polyhedra).
- Extends to **Alexandrov's Uniqueness**: gluing a polygon's boundary yields at most
  one convex polyhedron ([Alexandrov's Theorem](/portfolio/study/alexandrov-theorem/)).

## Related
[Rigidity (Generic & Minimal)](/portfolio/study/rigidity/) · [Alexandrov's Theorem](/portfolio/study/alexandrov-theorem/)
