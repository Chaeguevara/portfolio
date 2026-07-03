---
type: concept
title: Single-Vertex Flat-Foldability
lang: en
pair: "[[single-vertex-flat-foldability.ko]]"
course: "6.849"
lectures: [3]
summary: "Deciding whether one interior vertex can fold flat — easy: check even degree, Kawasaki, Maekawa, and a layer-order pass."
tags: [origami, flat-folding, algorithms]
prereqs: [[[kawasaki-theorem]], [[maekawa-theorem]]]
related: [[[big-little-big-lemma]], [[flat-foldability]], [[flat-foldability-np-hardness]]]
source: [[[L03-single-vertex-crease-patterns]]]
status: draft
---
Single-Vertex Flat-Foldability

*(한국어: [단일 꼭짓점 평평 접힘 (Single-Vertex Flat-Foldability)](/portfolio/study/single-vertex-flat-foldability.ko/))*

> Deciding whether one interior vertex can fold flat — easy: check even degree, Kawasaki, Maekawa, and a layer-order pass.

## Idea
"Local" flat foldability isolates a single interior vertex and ignores the rest of
the sheet. Unlike the global problem, this is **algorithmically easy** (linear
time). It is the building block: a crease pattern can only fold flat if *every*
vertex does locally.

## Conditions (necessary & sufficient for one vertex)
1. **Even degree** — `2n` creases (else not foldable; from [Maekawa's Theorem](/portfolio/study/maekawa-theorem/)).
2. **[Kawasaki's Theorem](/portfolio/study/kawasaki-theorem/)** — alternating angles sum to 180° each.
3. A valid **[Mountain–Valley Assignment](/portfolio/study/mountain-valley-assignment/)** exists obeying [Maekawa's Theorem](/portfolio/study/maekawa-theorem/)
   `|M−V|=2` **and** a consistent layer order (no self-penetration).

The [Big–Little–Big Lemma](/portfolio/study/big-little-big-lemma/) gives a greedy forcing rule that finds such an MV
assignment (or proves none exists) efficiently.

## Why "easy locally, hard globally"
A single vertex has only a circular stack of wedges to order; consistency is a
local 1D problem. Across many vertices the layer orders must agree simultaneously,
which is what makes the global problem [NP-hard](/portfolio/study/flat-foldability-np-hardness/).

## Related
[Kawasaki's Theorem](/portfolio/study/kawasaki-theorem/) · [Maekawa's Theorem](/portfolio/study/maekawa-theorem/) · [Big–Little–Big Lemma](/portfolio/study/big-little-big-lemma/) · [Flat-Foldability](/portfolio/study/flat-foldability/)
