# Gore-Lantern Oval — glueless packaging base pattern (design)

**Date:** 2026-07-04
**Status:** approved (Phase 1 scoped for implementation)
**Goal:** An armadillo-inspired **glueless packaging** form. The starting pattern
folds/deploys into a **closed, faceted OVAL** (prolate ellipsoid) built entirely
from **flat planar segments** — so each leaf can be 3D-printed flat and folded /
assembled with hinges, consistent with the existing Folded-lab print-kit pipeline.

## Context

The Folded lab (`/lab`, `src/lib/labApp.ts`) has a closed-form built-in engine
(Miura / Accordion / Fan / Auxetic) driven by a single **fold slider**, plus a
compliant solver path (`importSVG` + `createSolver`) for example patterns, a
print-kit (`src/app/fold/printKit.ts` — living + mid-lock-pin STL, assembly map),
and auxetic cut-pattern SVG export. This pattern must fit those conventions:
straight creases, flat panels, fold-flat-then-assemble.

Chosen family (from brainstorm): **① Gore lantern** first, then **blend** in
② waterbomb pole tucks and ③ Kresling/bistable snap-lock for the glueless close.

## Geometry — faceted prolate ellipsoid of revolution

Parameters: **N** gores (longitudes), **M** rings (latitude bands),
**r** equatorial radius, **α** aspect (polar/equatorial; α>1 = egg/oval).

Ellipsoid vertex for ring `i` (0..M), gore `j` (0..N):
```
lat = -π/2 + π·i/M           lon = 2π·j/N
P(i,j) = ( r·cos(lat)·cos(lon),  α·r·sin(lat),  r·cos(lat)·sin(lon) )
```
- **Faces:** per band a quad (2 triangles) between rings i, i+1 and gores j, j+1;
  the top and bottom bands collapse to **triangles** at the two pole vertices.
- **Each gore is a developable strip** of M flat trapezoids (triangles at poles):
  - facet **width** at ring i = chord `2·r·cos(lat_i)·sin(π/N)` (narrows to the poles),
  - facet **height** = meridian chord `|P(i+1,j) − P(i,j)|`.
- **Flat state** = the N gore-strips laid side-by-side (small gap) in the z=0
  plane — this is the exact printable/cuttable crease pattern.
- **Creases:** horizontal **ring** creases (between trapezoids within a gore) +
  vertical **meridian seam** creases (between adjacent gores).

## Phase 1 — lab built-in + configurator (this spec)

- New closed-form built-in **`gore`** in `labApp.ts` (`PatternId += 'gore'`),
  registered like the others; appears in the PATTERN list.
- **Fold slider = deploy.** Phase-1 deploy is a **position morph**: vertex =
  lerp(flatLayout(i,j), P(i,j), ease(fold)). **Both endpoints are exact** — the
  flat developable pattern (fold=0) and the closed oval (fold=1). The mid-fold is
  a visual bend, *not yet* a rigid mechanism (rigidifying = later refinement).
- **Configurator** (shown only when `gore` active, mirroring the auxetic panel):
  **N gores**, **M rings**, **aspect α**; deploy = fold slider. Live re-render on
  change via a `setGore({gores?, rings?, aspect?})` method (rebuilds the builder).
- Minimap: show the flat gore layout; DATA line: `N gores · M rings · oval α`.

## Phase 2 — glueless close (blend, later)

- **Seam lock (③):** the last gore's meridian edge carries tabs that snap/interlock
  into slots on the first gore — closes the barrel without glue.
- **Pole caps (②):** waterbomb-style tuck at each pole to close the ends.
- Phase 1 only *forms* the oval and exposes the seam + pole locations.

## Phase 3 — fabrication (reuse existing, later)

- Flat gore layout → **print-kit** (`buildPrintKit`): each gore a flat printed
  leaf, hinged at ring + seam creases (living or mid-lock pin), nested.
- Flat **cut-pattern SVG** export (like `auxeticCutSVG`) for laser / die-cut
  glueless packaging.
- **Assembly map** shows gore leaves ↔ their place in the oval.

## Verification (Phase 1)

Node self-check (`scripts/check-fold.mjs`, no DOM/GL needed for the pure builder):
- at fold=1, every vertex lies on the ellipsoid within tolerance;
- flat panels are planar, and each facet's edge lengths are equal flat↔folded
  (developable/rigid panels — the fold preserves lengths);
- face / vertex counts match N, M (incl. pole triangles);
- `astro build` exits 0.

## Key decisions

1. **Phase-1 deploy = position morph** with exact flat + oval endpoints (not a
   rigid single-DOF mechanism yet).
2. **Glueless lock is Phase 2** — Phase 1 forms the oval and marks seam/pole sites.
3. Straight creases, flat planar panels only (fits the flat-print pipeline).

## Out of scope (Phase 1)

Rigid-foldability of the in-between, the seam/pole locking geometry, print-kit and
cut-SVG export for gore, and any glue-based fallback.
