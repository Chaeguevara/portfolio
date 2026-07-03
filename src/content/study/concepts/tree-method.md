---
type: concept
title: Tree Method (Origami Design)
lang: en
pair: "[[tree-method.ko]]"
course: "6.849"
lectures: [3, 4, 5]
summary: Design an origami base by packing the legs of a stick-figure tree as circles/rivers on the square, then filling regions with molecules.
tags: [origami, design, algorithms]
prereqs: [[[crease-pattern]]]
related: [[[uniaxial-base]], [[universal-molecule]], [[box-pleating]], [[flat-foldability-np-hardness]]]
source: [[[L03-single-vertex-crease-patterns]], [[L04-efficient-origami-design]], [[L05-artistic-origami-design]]]
status: draft
---
# Tree Method (Origami Design)

*(한국어: [트리 방법 (Tree Method, 종이접기 설계)](/portfolio/study/tree-method.ko/))*

> Design an origami base by packing the legs of a stick-figure tree as circles/rivers on the square, then filling regions with molecules.

## Idea
The **tree method** turns a target shape, abstracted as a **metric tree** (a
stick figure with required leg lengths), into a crease pattern that folds to a
[Uniaxial Base](/portfolio/study/uniaxial-base/) matching that tree. Each leaf flap needs a circle of paper of its
length; each internal edge needs a "river" of constant width. You **pack** these
circles and rivers into the square, then fill the leftover polygons with
[Universal Molecule](/portfolio/study/universal-molecule/)s. Implemented in Robert Lang's **TreeMaker**.

## Why it matters
This is *the* algorithm behind modern complex origami design (insects, animals
with many legs). It converts "I want this shape" into concrete creases.

## Details
- **Optimizing** the packing (smallest paper / longest flaps) is **NP-complete** —
  one of the hardness results of [NP-Hardness of Flat Foldability](/portfolio/study/flat-foldability-np-hardness/) (Lecture 5).
- The active paths between touching circles determine the base's ridge creases.
- [Box Pleating & Universal Hinge Patterns](/portfolio/study/box-pleating/) is a discretized, grid-aligned variant from *Origami Design
  Secrets*.
- Contrast with **Origamizer**, which folds any polyhedral surface (watertight) by
  a different, tucking-based method.

## Related
[Uniaxial Base](/portfolio/study/uniaxial-base/) · [Universal Molecule](/portfolio/study/universal-molecule/) · [Box Pleating & Universal Hinge Patterns](/portfolio/study/box-pleating/) · [NP-Hardness of Flat Foldability](/portfolio/study/flat-foldability-np-hardness/)
