---
type: concept
title: Flat-Foldability
lang: en
pair: "[[flat-foldability.ko]]"
course: "6.849"
lectures: [2, 3, 7]
summary: Whether a crease pattern can be folded into a flat (zero-thickness) state without the paper crossing itself.
tags: [origami, flat-folding]
prereqs: [[[crease-pattern]], [[mountain-valley-assignment]]]
related: [[[single-vertex-flat-foldability]], [[map-folding]], [[flat-foldability-np-hardness]]]
source: [[[L02-simple-folds]], [[L03-single-vertex-crease-patterns]], [[L07-origami-is-hard]]]
status: draft
---
# Flat-Foldability

*(한국어: [평평 접힘 (Flat-Foldability)](/portfolio/study/flat-foldability.ko/))*

> Whether a crease pattern can be folded into a flat (zero-thickness) state without the paper crossing itself.

## Idea
A crease pattern is **flat-foldable** if there is a way to fold along (only) its
creases so the result lies flat in a plane, with no two layers of paper passing
through each other. It splits into a *local* question (each vertex separately) and
a much harder *global* question (the whole sheet at once).

## Why it matters
Flat folding is the cleanest mathematical model of origami and the foundation for
the design results later in the course. We study it for art (tessellations),
practicality (compactly folding airbags, maps, solar sails), and as a gateway to
[Rigid Origami](/portfolio/study/rigid-origami/).

## Details
- **Local** flat-foldability at a single vertex is *easy* — decidable by
  [Kawasaki's Theorem](/portfolio/study/kawasaki-theorem/) (angles) + [Maekawa's Theorem](/portfolio/study/maekawa-theorem/) (MV counts); see
  [Single-Vertex Flat-Foldability](/portfolio/study/single-vertex-flat-foldability/).
- **Global** flat-foldability is **NP-hard** in general
  ([NP-Hardness of Flat Foldability](/portfolio/study/flat-foldability-np-hardness/)); the obstruction is consistent layer ordering.
- Special tractable cases: 1D strips (linear time) and 2×n maps; general
  [Map Folding](/portfolio/study/map-folding/) is open/hard.

## Related
[Single-Vertex Flat-Foldability](/portfolio/study/single-vertex-flat-foldability/) · [Kawasaki's Theorem](/portfolio/study/kawasaki-theorem/) · [Maekawa's Theorem](/portfolio/study/maekawa-theorem/) · [NP-Hardness of Flat Foldability](/portfolio/study/flat-foldability-np-hardness/)
