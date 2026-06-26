---
type: concept
title: Linkage
lang: en
pair: "[[linkage.ko]]"
course: "6.849"
lectures: [10]
summary: A collection of fixed-length bars joined at hinges (a graph with edge lengths); the basic object of linkage folding.
tags: [linkages]
prereqs: []
related: [[[configuration-space]], [[rigidity]], [[kempe-universality-theorem]]]
source: [[[L10-kempe-s-universality-theorem]]]
status: draft
---
# Linkage

*(한국어: [링크 (Linkage)](/portfolio/study/linkage.ko/))*

> A collection of fixed-length bars joined at hinges (a graph with edge lengths); the basic object of linkage folding.

## Idea
A **linkage** is a graph whose edges are rigid **bars** of fixed length and whose
vertices are **joints** that can rotate freely. A specific placement of the joints
in the plane (or space) that respects all bar lengths is a **configuration**.
Linkages model robot arms, mechanisms, protein backbones, and folding rulers.

## Why it matters
The whole middle third of the course asks linkage-folding questions: *Can this
linkage move at all? Can it reach a given configuration? Can it get stuck (lock)?*
These connect origami (paper as a special linkage) to robotics and biology.

## Vocabulary
- **Chain** — a path graph (open chain) or cycle (closed chain / polygon).
- **Tree linkage** — a tree-shaped graph of bars.
- The space of all valid configurations is the [Configuration Space](/portfolio/study/configuration-space/).
- Whether a linkage can move is the subject of [Rigidity (Generic & Minimal)](/portfolio/study/rigidity/).

## Related
[Configuration Space](/portfolio/study/configuration-space/) · [Rigidity (Generic & Minimal)](/portfolio/study/rigidity/) · [Carpenter's Rule Theorem](/portfolio/study/carpenters-rule-theorem/) · [Kempe's Universality Theorem](/portfolio/study/kempe-universality-theorem/)
