---
type: concept
title: Crease Torsional Spring
lang: en
pair: "[[crease-torsional-spring.ko]]"
summary: A fold line as a hinge force — torque K·(target − θ) applied at the two apex vertices along face normals, reactions split over the crease endpoints.
tags: [origami, simulation, implementation]
prereqs: [[[compliant-fold-simulation]]]
related: [[[mountain-valley-assignment]], [[axial-spring-and-timestep]]]
source: []
status: draft
---
# Crease Torsional Spring

*(한국어: [크리스 비틀림 스프링](/portfolio/study/crease-torsional-spring.ko/))*

> A fold line as a hinge force — torque K·(target − θ) applied at the two apex
> vertices along face normals, reactions split over the crease endpoints.

## Idea
Each interior crease with adjacent triangles forms a **4-node stencil**: the two
crease endpoints and the two apex vertices (one per triangle). The dihedral
angle is `θ = atan2(dot(cross(n₁, ê), n₂), dot(n₁, n₂))` with `ê` the unit
crease vector, unwrapped against the previous step to survive ±π crossings.
A spring with stiffness `K = k·L₀` (fold creases and facet diagonals get
separate `k`) produces `F = K·(percent·target − θ)`.

## Why it matters
This is how a 1-DOF angular constraint becomes plain forces on vertices — the
whole fold behavior of the sheet reduces to it. The
[Mountain–Valley Assignment](/portfolio/study/mountain-valley-assignment/) enters
only through the *sign* of the target angle.

## Details
- Apex forces: `(F/h)·n` along that triangle's normal, where `h` is the apex's
  perpendicular distance to the crease line (its moment arm).
- Reactions on the crease endpoints: `−F·((1−c)/h₁·n₁ + …)` weighted by the
  normalized projection `c` of each apex onto the crease — net force and torque
  cancel by construction.
- Degenerate guard: if the crease length or either height is ~0, the hinge is
  skipped that step (a collapsed fold has no defined normal direction).
- Facet ("F") diagonals from triangulation are the same spring with target 0 —
  they keep polygonal faces planar.

## Related
[Compliant Fold Simulation](/portfolio/study/compliant-fold-simulation/) · [Mountain–Valley Assignment](/portfolio/study/mountain-valley-assignment/)
