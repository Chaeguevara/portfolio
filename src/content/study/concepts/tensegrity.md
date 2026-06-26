---
type: concept
title: Tensegrity
lang: en
pair: "[[tensegrity.ko]]"
course: "6.849"
lectures: [12]
summary: A framework with struts (can't shrink), cables (can't grow), and bars (fixed); stabilized by an equilibrium stress.
tags: [linkages, rigidity]
prereqs: [[[infinitesimal-rigidity]]]
related: [[[infinitesimal-rigidity]], [[rigidity]]]
source: [[[L12-tensegrities-carpenter-s-rules]]]
status: draft
---
# Tensegrity

*(한국어: [텐세그리티 (Tensegrity)](/portfolio/study/tensegrity.ko/))*

> A framework with struts (can't shrink), cables (can't grow), and bars (fixed); stabilized by an equilibrium stress.

## Idea
A **tensegrity** generalizes a bar framework by allowing **inequality** members:
- **cables** may shrink but not stretch (distance ≤ length),
- **struts** may stretch but not shrink (distance ≥ length),
- **bars** are fixed (distance = length).

Famously coined by Buckminster Fuller, tensegrities can be rigid even though no two
struts touch — held together by tension. Rigidity is certified by an **equilibrium
stress** (a self-stress balancing tension and compression at every joint).

## Why it matters
Tensegrity extends [Infinitesimal Rigidity](/portfolio/study/infinitesimal-rigidity/) to one-sided constraints, modeling
cable-and-strut sculptures, deployable structures, and biological cell scaffolds.
A neat special case — **spider webs** — connects back to the algorithmic design of
**origami tessellations**.

## Details
- The test uses the rigidity matrix plus sign conditions on the stress (Maxwell–
  Cremona / polyhedral-lifting duality).
- Springs can simulate bars in physical/numeric constructions.

## Related
[Infinitesimal Rigidity](/portfolio/study/infinitesimal-rigidity/) · [Rigidity (Generic & Minimal)](/portfolio/study/rigidity/)
