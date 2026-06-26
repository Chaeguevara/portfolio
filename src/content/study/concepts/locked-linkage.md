---
type: concept
title: Locked Linkage
lang: en
pair: "[[locked-linkage.ko]]"
course: "6.849"
lectures: [13]
summary: A linkage stuck in a configuration it can't continuously move out of (to straighten/convexify) without self-crossing.
tags: [linkages]
prereqs: [[[configuration-space]], [[carpenters-rule-theorem]]]
related: [[[carpenters-rule-theorem]], [[pseudotriangulation]], [[fixed-angle-linkage]]]
source: [[[L13-locked-linkages]]]
status: draft
---
# Locked Linkage

*(한국어: [갇힌 링크 (Locked Linkage)](/portfolio/study/locked-linkage.ko/))*

> A linkage stuck in a configuration it can't continuously move out of (to straighten/convexify) without self-crossing.

## Idea
A linkage is **locked** if its current configuration sits in a
[configuration-space](/portfolio/study/configuration-space/) component that cannot reach the
"canonical" unfolded state (straight chain / convex polygon) by any non-crossing
motion. Intuitively, it is tangled and can't get free without passing bars through
each other.

## Why it matters
Locking is the obstruction the [Carpenter's Rule Theorem](/portfolio/study/carpenters-rule-theorem/) *rules out in 2D* — but
which reappears in 3D and for trees. Knowing what can lock tells you which
mechanisms / robot arms / molecules can get stuck.

## What locks and what doesn't
- **2D open chains & simple polygons:** never lock (Carpenter's Rule).
- **2D trees:** *can* lock — significant recent progress on which ones.
- **3D open chains:** *can* lock (the classic "knitting needles" example).
- **4D+ open chains:** never lock.
- Proving something locked uses **infinitesimally locked** linkages and "Rules 1
  and 2"; unlocking uses [Pointed Pseudotriangulation](/portfolio/study/pseudotriangulation/)/energy algorithms.

## Related
[Carpenter's Rule Theorem](/portfolio/study/carpenters-rule-theorem/) · [Pointed Pseudotriangulation](/portfolio/study/pseudotriangulation/) · [Fixed-Angle Linkage (Protein Folding)](/portfolio/study/fixed-angle-linkage/)
