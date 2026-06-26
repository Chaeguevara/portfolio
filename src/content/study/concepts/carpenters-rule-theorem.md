---
type: concept
title: Carpenter's Rule Theorem
lang: en
pair: "[[carpenters-rule-theorem.ko]]"
course: "6.849"
lectures: [12]
summary: Any planar open chain or simple polygon can be straightened/convexified without self-intersection — 2D chains never lock.
tags: [linkages, theorem]
prereqs: [[[linkage]], [[configuration-space]]]
related: [[[locked-linkage]], [[pseudotriangulation]], [[hinged-dissection]]]
source: [[[L12-tensegrities-carpenter-s-rules]]]
status: draft
---
# Carpenter's Rule Theorem

*(한국어: [목수자 정리 (Carpenter's Rule Theorem)](/portfolio/study/carpenters-rule-theorem.ko/))*

> Any planar open chain or simple polygon can be straightened/convexified without self-intersection — 2D chains never lock.

## Statement
A **planar open chain** (non-crossing path of bars) can always be **straightened**,
and a **simple polygon** (closed chain) can always be **convexified**, by a
continuous motion that never lets bars cross. Equivalently: **2D chains cannot
lock** — their [Configuration Space](/portfolio/study/configuration-space/) is connected.

## Why it matters
This was Demaine's PhD thesis result and the gateway to the theory of
[Locked Linkage](/portfolio/study/locked-linkage/)s. It cleanly answers "can a 2D robot arm always unfold?" — yes —
and contrasts sharply with 3D, where chains *can* lock.

## Proof idea — expansive motions
There exists an **expansive** motion: one in which the distance between every pair
of vertices is non-decreasing. Expansion forbids self-crossing (crossing would
require some pair to approach). Such motions are produced by **pointed
[Pointed Pseudotriangulation](/portfolio/study/pseudotriangulation/)s**, whose mechanics give the algorithm; an energy-based
method gives another.

## Boundary of the phenomenon
- 2D **trees** (not just chains) *can* lock — the theorem is special to chains.
- 4D and higher open chains can't lock (room to maneuver).
- The expansiveness idea recurs in [Hinged Dissection](/portfolio/study/hinged-dissection/) ("slender adornments").

## Related
[Locked Linkage](/portfolio/study/locked-linkage/) · [Pointed Pseudotriangulation](/portfolio/study/pseudotriangulation/) · [Configuration Space](/portfolio/study/configuration-space/)
