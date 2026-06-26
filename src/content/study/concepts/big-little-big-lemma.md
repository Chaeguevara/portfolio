---
type: concept
title: Big–Little–Big Lemma
lang: en
pair: "[[big-little-big-lemma.ko]]"
course: "6.849"
lectures: [3]
summary: At a flat-foldable vertex, the crease inside a strictly-smallest angle (a local minimum) is forced to differ in M/V from its two neighbors.
tags: [origami, flat-folding, theorem]
prereqs: [[[mountain-valley-assignment]], [[kawasaki-theorem]]]
related: [[[single-vertex-flat-foldability]], [[maekawa-theorem]]]
source: [[[L03-single-vertex-crease-patterns]]]
status: draft
---
# Big–Little–Big Lemma

*(한국어: [큰-작은-큰 보조정리 (Big–Little–Big Lemma)](/portfolio/study/big-little-big-lemma.ko/))*

> At a flat-foldable vertex, the crease inside a strictly-smallest angle (a local minimum) is forced to differ in M/V from its two neighbors.

## Statement
Consider the angles around an interior vertex. If an angle `αᵢ` is a **strict local
minimum** — smaller than both neighbors (a "little" angle between two "big" ones) —
then in any flat folding, the two creases bounding `αᵢ` must have **opposite**
mountain/valley labels. The little sector folds and tucks between its neighbors.

## Why it matters
It turns flat-foldability of a vertex into a **greedy elimination algorithm**:
repeatedly find a local-min angle, force its bounding creases to opposite MV,
"crimp" it away (merge the angle with its neighbors), and recurse. This is the
engine behind efficient [Single-Vertex Flat-Foldability](/portfolio/study/single-vertex-flat-foldability/) testing and counting
valid [Mountain–Valley Assignment](/portfolio/study/mountain-valley-assignment/)s.

## Details
- Equal smallest angles are handled as a tie case; the basic rule needs a *strict*
  minimum.
- Combined with [Maekawa's Theorem](/portfolio/study/maekawa-theorem/) (the global ±2 count) and
  [Kawasaki's Theorem](/portfolio/study/kawasaki-theorem/) (the angle condition), it characterizes which MV assignments
  fold flat at a vertex.

## Related
[Single-Vertex Flat-Foldability](/portfolio/study/single-vertex-flat-foldability/) · [Maekawa's Theorem](/portfolio/study/maekawa-theorem/) · [Kawasaki's Theorem](/portfolio/study/kawasaki-theorem/)
