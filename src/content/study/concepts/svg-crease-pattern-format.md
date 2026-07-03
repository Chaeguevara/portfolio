---
type: concept
title: SVG Crease Pattern Format
lang: en
pair: "[[svg-crease-pattern-format.ko]]"
summary: The de-facto interchange convention — stroke color encodes crease type (black border, red mountain, blue valley), stroke opacity encodes fold angle / 180°.
tags: [origami, file-format, implementation]
prereqs: [[[crease-pattern]], [[mountain-valley-assignment]]]
related: [[[crease-pattern-import-pipeline]]]
source: []
status: draft
---
# SVG Crease Pattern Format

*(한국어: [SVG 크리스 패턴 포맷](/portfolio/study/svg-crease-pattern-format.ko/))*

> The de-facto interchange convention — stroke color encodes crease type
> (black border, red mountain, blue valley), stroke opacity encodes fold
> angle / 180°.

## Idea
Origami Simulator established a plain-SVG convention for crease patterns: any
`line`/`path`/`rect`/`polyline`/`polygon` is a crease, classified purely by
stroke color — **black** border, **red** mountain, **blue** valley, **yellow**
preset facet, **magenta** free hinge, **green** cut. The target fold angle is
`opacity × stroke-opacity × 180°`, mountain negative. Any drawing tool becomes
a crease-pattern editor.

## Why it matters
Files round-trip between tools that honor the convention: a pattern drawn in
Illustrator loads into origamisimulator.org *and* `/portfolio/simulator`; a
pattern exported from either prints as a fold-by-hand template with the fold
semantics still machine-readable.

## Details
- Color matching is exact against the named/hex/rgb spellings of those six
  colors — an off-red like `#fe0000` is ignored (and should be reported), not
  guessed.
- Missing opacity defaults to 1 → ±180° full folds.
- The geometry carries no topology: endpoints only *nearly* coincide and
  crossings are implicit — recovering the fold graph is the
  [import pipeline](/portfolio/study/crease-pattern-import-pipeline/)'s job.
- Partial-angle creases (e.g. a 90° Miura wall) are just lower-opacity strokes.

## Related
[Crease Pattern](/portfolio/study/crease-pattern/) · [Crease Pattern Import Pipeline](/portfolio/study/crease-pattern-import-pipeline/)
