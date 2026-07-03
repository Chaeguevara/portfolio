---
type: concept
title: Compliant Fold Simulation
lang: en
pair: "[[compliant-fold-simulation.ko]]"
summary: Simulating folding by relaxing a spring-mass sheet toward crease target angles — every crease folds simultaneously, no fold sequence needed.
tags: [origami, simulation, implementation]
prereqs: [[[crease-pattern]]]
related: [[[rigid-origami]], [[crease-torsional-spring]], [[axial-spring-and-timestep]], [[crease-pattern-import-pipeline]]]
source: []
status: draft
---
# Compliant Fold Simulation

*(한국어: [순응형 접기 시뮬레이션](/portfolio/study/compliant-fold-simulation.ko/))*

> Simulating folding by relaxing a spring-mass sheet toward crease target
> angles — every crease folds simultaneously, no fold sequence needed.

## Idea
Instead of solving the exact kinematics of [Rigid Origami](/portfolio/study/rigid-origami/),
a **compliant** simulator treats the triangulated sheet as a network of springs:
every edge is an axial spring, every crease a torsional spring pulling its two
faces toward `foldPercent × targetAngle`. Iterating small dynamic steps from the
flat state folds *all* creases at once — the approach of Ghassaei, Demaine &
Gershenfeld's Origami Simulator (7OSME), building on Schenk & Guest's
structural-engineering model and Tachi's freeform origami.

## Why it matters
Rigid kinematics fails on patterns that are not strictly rigid-foldable (most
interesting ones); a compliant model always produces *some* folded state, and
material stiffness falls out as tunable parameters. This is the engine behind
`/portfolio/simulator` (`src/app/fold/solver.ts` — a CPU port of the original
GPU shaders).

## Details
- Constraints: axial ([Axial Springs & Time Step](/portfolio/study/axial-spring-and-timestep/)),
  crease torsion ([Crease Torsional Spring](/portfolio/study/crease-torsional-spring/)),
  plus optional face anti-shear (not ported; triangles are near-rigid from their
  three axial springs alone).
- Integration: symplectic Euler — velocity first from forces at the current
  position, then position from the *new* velocity. Node mass is uniformly 1.
- `foldPercent ∈ [−1, 1]` scales every crease's target angle; negative values
  swap mountain ↔ valley globally.
- No collision handling: self-intersecting patterns (e.g. the "needsCollisions"
  examples) fold through themselves.

## Related
[Rigid Origami](/portfolio/study/rigid-origami/) · [Crease Torsional Spring](/portfolio/study/crease-torsional-spring/) · [Axial Springs & Time Step](/portfolio/study/axial-spring-and-timestep/)
