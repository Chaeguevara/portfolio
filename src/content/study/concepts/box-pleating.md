---
type: concept
title: Box Pleating & Universal Hinge Patterns
lang: en
pair: "[[box-pleating.ko]]"
course: "6.849"
lectures: [4, 7]
summary: Designing on a 45°/90° grid so a single fixed hinge pattern can fold any cube-complex (polycube) shape.
tags: [origami, design]
prereqs: [[[tree-method]]]
related: [[[tree-method]], [[flat-foldability-np-hardness]]]
source: [[[L04-efficient-origami-design]], [[L07-origami-is-hard]]]
status: draft
---
# Box Pleating & Universal Hinge Patterns

*(한국어: [박스 플리팅과 보편 힌지 패턴 (Box Pleating)](/portfolio/study/box-pleating.ko/))*

> Designing on a 45°/90° grid so a single fixed hinge pattern can fold any cube-complex (polycube) shape.

## Idea
**Box pleating** restricts all creases to a square grid with 45° diagonals. Its
power: a **single universal hinge pattern** (one fixed set of creases) has subsets
that fold *any* orthogonal shape built from cubes (a **polycube**). Instead of a
brand-new crease pattern per model, you reuse one pattern and just choose which
creases to fold.

## Why it matters
This is a striking *universality* result (Lecture 7): `n` cubes fold from an
`O(n) × O(n)` square. The special case of **orthogonal mazes** wastes almost no
paper — folding only a small constant factor smaller than the sheet (try the "Maze
Folder"). It is also the grid-aligned, discretized form of the [Tree Method (Origami Design)](/portfolio/study/tree-method/) from
*Origami Design Secrets*.

## Details
- Universal hinge patterns trade efficiency for reusability and predictability.
- Box pleating underlies much modern tessellation and modular design.

## Related
[Tree Method (Origami Design)](/portfolio/study/tree-method/) · [NP-Hardness of Flat Foldability](/portfolio/study/flat-foldability-np-hardness/)
