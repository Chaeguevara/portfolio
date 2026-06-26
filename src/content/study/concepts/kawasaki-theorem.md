---
type: concept
title: Kawasaki's Theorem
lang: en
pair: "[[kawasaki-theorem.ko]]"
course: "6.849"
lectures: [3]
summary: A single vertex of degree 2n folds flat iff its alternating angle sum is 0° — equivalently, odd-indexed angles sum to 180°.
tags: [origami, flat-folding, theorem]
prereqs: [[[crease-pattern]]]
related: [[[maekawa-theorem]], [[single-vertex-flat-foldability]]]
source: [[[L03-single-vertex-crease-patterns]]]
status: draft
---
# Kawasaki's Theorem

*(한국어: [가와사키 정리 (Kawasaki's Theorem)](/portfolio/study/kawasaki-theorem.ko/))*

> A single vertex of degree 2n folds flat iff its alternating angle sum is 0° — equivalently, odd-indexed angles sum to 180°.

## Statement
Let the consecutive angles around an interior vertex be `α₁, α₂, …, α₂ₙ`. The
vertex is flat-foldable (geometrically) iff

```
α₁ − α₂ + α₃ − α₄ + … + α₂ₙ₋₁ − α₂ₙ = 0
```

equivalently `α₁ + α₃ + … = α₂ + α₄ + … = 180°`. This is the **geometric** half of
single-vertex flat foldability; [Maekawa's Theorem](/portfolio/study/maekawa-theorem/) is the combinatorial half.

## Why it matters
It tells you, from the angles **alone** (before assigning mountains/valleys),
whether a vertex *can* fold flat at all. Necessary requirement: the degree must be
even, else the alternating sum can't vanish.

## Intuition
Folding flat means that as you go around the vertex, the paper must return to its
start direction. Each angle advances the direction; alternating ± because
consecutive sectors fold to opposite sides. They cancel exactly when the two
alternating groups each total a straight angle.

## Special case — degree 4
With angles `α, β, α, β` and `α + β = 180°`, Kawasaki is automatically satisfied;
the interesting constraints then come from MV ([Maekawa's Theorem](/portfolio/study/maekawa-theorem/),
[Big–Little–Big Lemma](/portfolio/study/big-little-big-lemma/)) and [Rigid Origami](/portfolio/study/rigid-origami/).

## Related
[Maekawa's Theorem](/portfolio/study/maekawa-theorem/) · [Single-Vertex Flat-Foldability](/portfolio/study/single-vertex-flat-foldability/) · [Big–Little–Big Lemma](/portfolio/study/big-little-big-lemma/)
