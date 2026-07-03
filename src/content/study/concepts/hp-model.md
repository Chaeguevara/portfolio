---
type: concept
title: HP Model of Protein Folding
lang: en
pair: "[[hp-model.ko]]"
course: "6.849"
lectures: [21]
summary: A lattice model where amino acids are Hydrophobic or Polar; the optimal (max H–H contacts) folding is NP-complete.
tags: [linkages, biology, complexity]
prereqs: [[[fixed-angle-linkage]]]
related: [[[fixed-angle-linkage]]]
source: [[[L21-hp-model-interlocked-chains]]]
status: draft
---
# HP Model of Protein Folding

*(한국어: [HP 모델 (HP Model)](/portfolio/study/hp-model.ko/))*

> A lattice model where amino acids are Hydrophobic or Polar; the optimal (max H–H contacts) folding is NP-complete.

## Idea
The **HP model** is a simplified theory of the *forces* behind protein folding
(rather than the mechanics of [Fixed-Angle Linkage (Protein Folding)](/portfolio/study/fixed-angle-linkage/)s). Each amino acid is labeled
**H** (hydrophobic) or **P** (polar). The chain is placed on a lattice; the energy
rewards adjacent H–H pairs, modeling hydrophobic residues hiding from surrounding
water. The predicted fold is the lattice placement maximizing H–H contacts.

## Why it matters
It captures the dominant driving force of folding in a discrete, analyzable form.
But it shows folding is computationally hard: finding the optimal HP folding is
**NP-complete**.

## Results
- **NP-completeness** of optimal folding, with decent **constant-factor
  approximation** algorithms.
- **Protein design** (engineering a sequence with a *unique* optimal fold) is a
  step the course examines; whether design is similarly hard is not fully known.

## Related
[Fixed-Angle Linkage (Protein Folding)](/portfolio/study/fixed-angle-linkage/)
