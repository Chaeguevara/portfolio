---
type: concept
title: Dehn Invariant
lang: en
pair: "[[dehn-invariant.ko]]"
course: "6.849"
lectures: [14]
summary: An algebraic quantity (from edge lengths and dihedral angles) that must match for two 3D polyhedra to be scissors-congruent.
tags: [polyhedra, geometry, theorem]
prereqs: []
related: [[[hinged-dissection]]]
source: [[[L14-hinged-dissections]]]
status: draft
---
# Dehn Invariant

*(한국어: [덴 불변량 (Dehn Invariant)](/portfolio/study/dehn-invariant.ko/))*

> An algebraic quantity (from edge lengths and dihedral angles) that must match for two 3D polyhedra to be scissors-congruent.

## Idea
In 2D, any two polygons of equal area are **scissors-congruent** (cut one into
pieces, reassemble into the other — Bolyai–Gerwien). In 3D this **fails**: equal
volume is not enough. The **Dehn invariant** is the extra obstruction — a value
computed from each edge as (length) ⊗ (dihedral angle), summed in a special
algebraic group (`ℝ ⊗_ℚ ℝ/πℚ`).

## Why it matters
It resolved **Hilbert's third problem**: a cube and a regular tetrahedron of equal
volume are **not** scissors-congruent, because their Dehn invariants differ. Two
polyhedra are scissors-congruent iff they have **both** equal volume **and** equal
Dehn invariant (Sydler).

## Course context
It appears via **[Hinged Dissection](/portfolio/study/hinged-dissection/)**: 2D dissections are flexible and even
hingeable, but 3D/4D dissection is constrained by the Dehn invariant — explaining
why the 3D theory is so much harder than the 2D theory.

## Related
[Hinged Dissection](/portfolio/study/hinged-dissection/)
