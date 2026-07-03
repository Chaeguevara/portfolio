---
type: concept
title: Axial Springs & Time Step
lang: en
pair: "[[axial-spring-and-timestep.ko]]"
summary: Every edge is a Kelvin–Voigt spring K = EA/L₀ with near-critical damping; the stable step is dt = 0.9 / (2π·√(K_max/m)).
tags: [origami, simulation, implementation]
prereqs: [[[compliant-fold-simulation]]]
related: [[[crease-torsional-spring]]]
source: []
status: draft
---
# Axial Springs & Time Step

*(한국어: [축 스프링과 시간 간격](/portfolio/study/axial-spring-and-timestep.ko/))*

> Every edge is a Kelvin–Voigt spring K = EA/L₀ with near-critical damping;
> the stable step is dt = 0.9 / (2π·√(K_max/m)).

## Idea
The sheet's in-plane behavior comes from putting a spring on **every** edge of
the triangulated pattern: `K = EA/L₀` (shorter edges are stiffer, approximating
uniform material) and damping `D = ζ·2·√(K·m)` — the critical-damping form with
ratio ζ. Force is `K·Δstretch + D·Δv` along the edge.

## Why it matters
Explicit integration of stiff springs blows up unless dt respects the fastest
oscillator. Taking the stiffest edge's natural frequency `f = √(K_max/m)` and
stepping at 90% of `1/(2πf)` keeps the whole mesh stable without per-pattern
tuning — this single rule is why arbitrary imported patterns "just work".

## Details
- Defaults from Origami Simulator: `EA = 20`, `ζ = 0.45`, mass `m = 1` per node.
- dt must be recomputed whenever stiffness or geometry changes (a UI stiffness
  slider changes `K_max`).
- Mean `|len/L₀ − 1|` over all edges is a cheap global strain readout — near 0
  when the folded state is consistent, a few % when the pattern fights itself.
- Three axial springs make each triangle nearly rigid in-plane, which is why a
  separate face anti-shear term is optional.

## Related
[Compliant Fold Simulation](/portfolio/study/compliant-fold-simulation/) · [Crease Torsional Spring](/portfolio/study/crease-torsional-spring/)
