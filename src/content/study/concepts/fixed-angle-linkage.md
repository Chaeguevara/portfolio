---
type: concept
title: Fixed-Angle Linkage (Protein Folding)
lang: en
pair: "[[fixed-angle-linkage.ko]]"
course: "6.849"
lectures: [20]
summary: A 3D linkage where both bar lengths and the angles between consecutive bars are fixed; models protein backbones.
tags: [linkages, biology, 3d]
prereqs: [[[linkage]], [[locked-linkage]]]
related: [[[locked-linkage]], [[hp-model]]]
source: [[[L20-protein-chains]]]
status: draft
---
# Fixed-Angle Linkage (Protein Folding)

*(한국어: [고정각 링크 (Fixed-Angle Linkage, 단백질 접힘)](/portfolio/study/fixed-angle-linkage.ko/))*

> A 3D linkage where both bar lengths and the angles between consecutive bars are fixed; models protein backbones.

## Idea
A **fixed-angle linkage** is a 3D chain/tree where, in addition to bar lengths, the
**angle between each pair of consecutive bars** is held constant; only the dihedral
(torsion) rotations are free. This is exactly the mechanical model of a molecule:
chemical bonds have fixed lengths and bond angles, and a protein backbone is a
fixed-angle tree (approximated by a fixed-angle chain).

## Why it matters
It is the course's bridge from abstract linkage folding to **protein folding** and
molecular biology. The same locking/reachability questions become biologically
meaningful: which shapes a protein can reach, whether it can flatten, whether it
can lock.

## Key questions & results
- **Span** — the farthest/nearest the endpoints can be folded.
- **Flattening** — does a non-self-intersecting flat state exist? (Flattening
  fixed-angle chains is strongly **NP-hard**.)
- **Flat-state connectivity** — can it move between any two flat states?
- **Producible chains** — states a simple **ribosome** model can produce (including
  all flat states) can all reach each other.
- The energetic/lattice abstraction is the [HP Model of Protein Folding](/portfolio/study/hp-model/).

## Related
[Linkage](/portfolio/study/linkage/) · [Locked Linkage](/portfolio/study/locked-linkage/) · [HP Model of Protein Folding](/portfolio/study/hp-model/)
