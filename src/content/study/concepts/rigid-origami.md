---
type: concept
title: Rigid Origami
lang: en
pair: "[[rigid-origami.ko]]"
course: "6.849"
lectures: [6, 9]
summary: Folding where faces stay rigid (flat) and only the creases move — the model for stiff materials, self-folding sheets, and architecture.
tags: [origami, rigidity, applications]
prereqs: [[[crease-pattern]], [[kawasaki-theorem]]]
related: [[[rigidity]], [[hypar-pleat-folding]], [[tensegrity]]]
source: [[[L06-architectural-origami]], [[L09-pleat-folding]]]
status: draft
---
# Rigid Origami

*(한국어: [강체 종이접기 (Rigid Origami)](/portfolio/study/rigid-origami.ko/))*

> Folding where faces stay rigid (flat) and only the creases move — the model for stiff materials, self-folding sheets, and architecture.

## Idea
In **rigid origami** the polygonal faces between creases cannot bend or stretch —
they are rigid panels, and motion happens only by rotating about the creases
(hinges). This is the right model when the "paper" is metal, plastic, solar-panel,
or a self-folding sheet, not flexible paper.

## Why it matters
Rigid foldability is what makes origami useful in **engineering and architecture**:
deployable structures, retractable roofs, space solar sails, PC-MEMS self-folding
robots. A pattern can be flat-foldable as paper yet *not* rigidly foldable, so this
is a genuinely stronger requirement.

## Details
- A **degree-4** vertex is rigidly foldable when one crease bisects the angle
  between two others (the "ruling" crease); it then has essentially one
  degree of freedom.
- Tools: [Rigidity (Generic & Minimal)](/portfolio/study/rigidity/) theory and the rigidity matrix ([Infinitesimal Rigidity](/portfolio/study/infinitesimal-rigidity/))
  carry over from linkages.
- Software (Tachi's Rigid Origami Simulator, Freeform Origami, Origamizer) explores
  the design space; many open problems remain (Lecture 6, guest lecture).

## Related
[Rigidity (Generic & Minimal)](/portfolio/study/rigidity/) · [Infinitesimal Rigidity](/portfolio/study/infinitesimal-rigidity/) · [Pleat Folding & the Hyperbolic Paraboloid](/portfolio/study/hypar-pleat-folding/) · [Kawasaki's Theorem](/portfolio/study/kawasaki-theorem/)
