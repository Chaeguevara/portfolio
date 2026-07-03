---
type: concept
title: Crease Pattern
lang: en
pair: "[[crease-pattern.ko]]"
course: "6.849"
lectures: [2, 3]
summary: The flat diagram of all fold lines drawn on the unfolded sheet of paper.
tags: [origami, flat-folding]
prereqs: []
related: [[[mountain-valley-assignment]], [[flat-foldability]], [[simple-fold]]]
source: [[[L02-simple-folds]], [[L03-single-vertex-crease-patterns]]]
status: draft
---
# Crease Pattern

*(한국어: [크리스 패턴 (Crease Pattern)](/portfolio/study/crease-pattern.ko/))*

> The flat diagram of all fold lines drawn on the unfolded sheet of paper.

## Idea
A **crease pattern (CP)** is the unfolded sheet together with the set of line
segments (creases) along which it will be folded. It records *where* the paper
folds but not yet *which way* each crease goes — that extra information is the
[Mountain–Valley Assignment](/portfolio/study/mountain-valley-assignment/).

## Why it matters
The crease pattern is the basic input to almost every origami question in the
course: *Can this CP be folded flat? Into what shape? By what sequence of folds?*
Origami **design** algorithms output a crease pattern; origami **foldability**
algorithms take one as input.

## Details
- Creases meeting at a point inside the sheet form an **interior vertex**; the
  paper around it must close up consistently when folded.
- A crease pattern says nothing about layer order by itself; deciding a valid
  folded state from a CP is the hard part (see [NP-Hardness of Flat Foldability](/portfolio/study/flat-foldability-np-hardness/)).
- Degree of a vertex = number of creases meeting there. Flat-foldable interior
  vertices always have *even* degree (a consequence of [Maekawa's Theorem](/portfolio/study/maekawa-theorem/)).

## Related
[Mountain–Valley Assignment](/portfolio/study/mountain-valley-assignment/) · [Flat-Foldability](/portfolio/study/flat-foldability/) · [Single-Vertex Flat-Foldability](/portfolio/study/single-vertex-flat-foldability/)
