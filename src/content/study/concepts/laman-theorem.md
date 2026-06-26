---
type: concept
title: Laman's Theorem
lang: en
pair: "[[laman-theorem.ko]]"
course: "6.849"
lectures: [11]
summary: A graph is minimally generically rigid in 2D iff it has 2n−3 edges and every k-vertex subset spans at most 2k−3 edges.
tags: [linkages, rigidity, theorem, algorithms]
prereqs: [[[rigidity]]]
related: [[[rigidity]], [[infinitesimal-rigidity]]]
source: [[[L11-rigidity-theory]]]
status: draft
---
# Laman's Theorem

*(한국어: [라만 정리 (Laman's Theorem)](/portfolio/study/laman-theorem.ko/))*

> A graph is minimally generically rigid in 2D iff it has 2n−3 edges and every k-vertex subset spans at most 2k−3 edges.

## Statement
For a graph on `n` vertices, the framework is **minimally generically rigid in the
plane** iff:
- it has exactly `2n − 3` edges, **and**
- every subset of `k` vertices induces at most `2k − 3` edges (a "no over-braced
  subgraph" condition, k ≥ 2).

The count `2n − 3` is the total degrees of freedom (`2n`) minus the 3 trivial plane
motions (2 translations + 1 rotation).

## Why it matters
It converts a *geometry* question (rigidity) into a purely *combinatorial* edge-
count condition, which can be checked **algorithmically** in polynomial time — the
**pebble game** does this in roughly quadratic time. Contrast with
**Henneberg's Theorem** (1911), also a 2D characterization but harder to turn into
an algorithm.

## Details
- The pebble game tests the `2k − 3` (and the simpler `2k`) sparsity condition by
  routing "pebbles" along edges.
- Extensions: decomposing a graph into rigid components, body-and-bar frameworks,
  angular constraints.
- **3D fails**: the analogous `3n − 6` count is necessary but not sufficient (the
  double-banana counterexample); no Laman-type theorem is known in 3D.

## Related
[Rigidity (Generic & Minimal)](/portfolio/study/rigidity/) · [Infinitesimal Rigidity](/portfolio/study/infinitesimal-rigidity/)
