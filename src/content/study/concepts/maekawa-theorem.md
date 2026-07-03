---
type: concept
title: Maekawa's Theorem
lang: en
pair: "[[maekawa-theorem.ko]]"
course: "6.849"
lectures: [3]
summary: At every interior vertex of a flat-foldable crease pattern, #mountains − #valleys = ±2.
tags: [origami, flat-folding, theorem]
prereqs: [[[mountain-valley-assignment]]]
related: [[[kawasaki-theorem]], [[single-vertex-flat-foldability]], [[big-little-big-lemma]]]
source: [[[L03-single-vertex-crease-patterns]]]
status: draft
---
# Maekawa's Theorem

*(한국어: [마에카와 정리 (Maekawa's Theorem)](/portfolio/study/maekawa-theorem.ko/))*

> At every interior vertex of a flat-foldable crease pattern, #mountains − #valleys = ±2.

## Statement
For an interior vertex with `M` mountain creases and `V` valley creases that folds
flat:

```
|M − V| = 2
```

So if the vertex has degree `2n`, the only options are `(M,V) = (n+1, n−1)` or
`(n−1, n+1)`. This is a **combinatorial** (MV-count) condition, the partner of the
**geometric** [Kawasaki's Theorem](/portfolio/study/kawasaki-theorem/).

## Why it matters
It is one half of the local flat-foldability test. Two immediate consequences:
- A vertex of **odd degree** can never fold flat (since M+V must split as ±2 apart,
  forcing M+V even).
- It bounds how many valid [Mountain–Valley Assignment](/portfolio/study/mountain-valley-assignment/)s a vertex can have.

## Proof sketch
Walk around the vertex once. Each mountain turns the "paper direction" one way,
each valley the other; for the layers to close up into a flat stack the signed
total must be exactly one full extra turn, i.e. ±2. (A winding / turning argument.)

## Caveat
Maekawa is **necessary but not sufficient** alone — you also need
[Kawasaki's Theorem](/portfolio/study/kawasaki-theorem/) on the angles, and globally a consistent layer order.

## Related
[Kawasaki's Theorem](/portfolio/study/kawasaki-theorem/) · [Single-Vertex Flat-Foldability](/portfolio/study/single-vertex-flat-foldability/) · [Big–Little–Big Lemma](/portfolio/study/big-little-big-lemma/)
