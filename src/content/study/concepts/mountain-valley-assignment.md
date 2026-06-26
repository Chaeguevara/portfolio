---
type: concept
title: Mountain–Valley Assignment
lang: en
pair: "[[mountain-valley-assignment.ko]]"
course: "6.849"
lectures: [2, 3]
summary: A labeling of every crease as a mountain (folds away) or valley (folds toward you).
tags: [origami, flat-folding]
prereqs: [[[crease-pattern]]]
related: [[[maekawa-theorem]], [[flat-foldability]]]
source: [[[L02-simple-folds]], [[L03-single-vertex-crease-patterns]]]
status: draft
---
# Mountain–Valley Assignment

*(한국어: [산-골 배정 (Mountain–Valley Assignment)](/portfolio/study/mountain-valley-assignment.ko/))*

> A labeling of every crease as a mountain (folds away) or valley (folds toward you).

## Idea
Given a [Crease Pattern](/portfolio/study/crease-pattern/), an **MV assignment** colors each crease either
**mountain (M)** — the ridge faces up, paper folds away from you — or
**valley (V)** — the groove faces up, paper folds toward you. M and V are mirror
images: flipping the paper over swaps them.

## Why it matters
A crease pattern can be foldable under one MV assignment and impossible under
another. Two of the course's central theorems constrain valid assignments at a
vertex: [Maekawa's Theorem](/portfolio/study/maekawa-theorem/) (a *combinatorial* count of M vs V) and the
[Big–Little–Big Lemma](/portfolio/study/big-little-big-lemma/) (a local forcing rule).

## Details
- At a flat-foldable interior vertex, [Maekawa's Theorem](/portfolio/study/maekawa-theorem/) forces |#M − #V| = 2.
- Even with a legal MV count, the *global* layer ordering may still force paper to
  pass through paper — which is why global flat foldability is hard
  ([NP-Hardness of Flat Foldability](/portfolio/study/flat-foldability-np-hardness/)).
- Counting how many MV assignments make a given CP flat-foldable is itself a rich
  combinatorial question.

## Related
[Crease Pattern](/portfolio/study/crease-pattern/) · [Maekawa's Theorem](/portfolio/study/maekawa-theorem/) · [Big–Little–Big Lemma](/portfolio/study/big-little-big-lemma/)
