---
type: concept
title: Configuration Space
lang: en
pair: "[[configuration-space.ko]]"
course: "6.849"
lectures: [10]
summary: The space of all valid placements of a linkage; folding motions are paths in it, and 'locked' means a disconnected component.
tags: [linkages, topology]
prereqs: [[[linkage]]]
related: [[[rigidity]], [[locked-linkage]], [[carpenters-rule-theorem]]]
source: [[[L10-kempe-s-universality-theorem]]]
status: draft
---
# Configuration Space

*(한국어: [구성 공간 (Configuration Space)](/portfolio/study/configuration-space.ko/))*

> The space of all valid placements of a linkage; folding motions are paths in it, and 'locked' means a disconnected component.

## Idea
The **configuration space** of a linkage is the set of *all* configurations (joint
placements) satisfying the bar-length constraints, viewed as one geometric/
topological space. A **folding motion** is a continuous path through this space; a
linkage "moves" exactly when its configuration space is not a single point.

## Why it matters
It reframes physical questions as topology:
- *Can A reach B?* → are A and B in the same **connected component**?
- *Is the linkage locked?* → is its current configuration in a component it can't
  leave to reach an "unfolded" one? (see [Locked Linkage](/portfolio/study/locked-linkage/))
- *Is it rigid?* → is the configuration isolated? (see [Rigidity (Generic & Minimal)](/portfolio/study/rigidity/))

## Details
- For a closed chain (polygon) in 2D with non-crossing required, the
  [Carpenter's Rule Theorem](/portfolio/study/carpenters-rule-theorem/) says the configuration space stays connected.
- High dimension helps: 4D open chains can never lock (extra room to maneuver).
- Configuration spaces are generally semi-algebraic sets (defined by polynomial
  equations from the squared bar lengths).

## Related
[Linkage](/portfolio/study/linkage/) · [Rigidity (Generic & Minimal)](/portfolio/study/rigidity/) · [Locked Linkage](/portfolio/study/locked-linkage/) · [Carpenter's Rule Theorem](/portfolio/study/carpenters-rule-theorem/)
