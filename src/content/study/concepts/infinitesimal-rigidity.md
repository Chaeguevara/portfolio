---
type: concept
title: Infinitesimal Rigidity
lang: en
pair: "[[infinitesimal-rigidity.ko]]"
course: "6.849"
lectures: [12]
summary: "A linear-algebra test: a framework is infinitesimally rigid if the rigidity matrix admits only trivial velocity assignments."
tags: [linkages, rigidity, linear-algebra]
prereqs: [[[rigidity]]]
related: [[[rigidity]], [[tensegrity]], [[laman-theorem]]]
source: [[[L12-tensegrities-carpenter-s-rules]]]
status: draft
---
Infinitesimal Rigidity

*(한국어: [무한소 강성 (Infinitesimal Rigidity)](/portfolio/study/infinitesimal-rigidity.ko/))*

> A linear-algebra test: a framework is infinitesimally rigid if the rigidity matrix admits only trivial velocity assignments.

## Idea
Assign each joint a velocity vector and ask which assignments preserve every bar
length **to first order** (each bar's endpoints have equal velocity components
along the bar). These solutions form the kernel of the **rigidity matrix**. The
framework is **infinitesimally rigid** if the only solutions are the trivial ones
(global rotations/translations).

## Why it matters
It linearizes rigidity, making it **efficiently computable in any dimension** via
linear algebra (rank of the rigidity matrix) — unlike combinatorial generic
rigidity, which is only cleanly characterized in 2D ([Laman's Theorem](/portfolio/study/laman-theorem/)).
Infinitesimal rigidity ⇒ rigidity, and generically the two coincide.

## Details
- Each bar `(i,j)` contributes the row condition `(pᵢ − pⱼ)·(vᵢ − vⱼ) = 0`.
- The trivial motions form a 3-dim space in 2D, 6-dim in 3D; "rigid" means the
  solution space is exactly that.
- It is the natural tool for [Tensegrity](/portfolio/study/tensegrity/) (adding inequality constraints for
  struts/cables) and for [Rigid Origami](/portfolio/study/rigid-origami/).

## Related
[Rigidity (Generic & Minimal)](/portfolio/study/rigidity/) · [Tensegrity](/portfolio/study/tensegrity/) · [Laman's Theorem](/portfolio/study/laman-theorem/)
