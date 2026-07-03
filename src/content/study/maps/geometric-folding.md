---
type: map
title: Geometric Folding
summary: Topic map of 6.849 concepts — EN with KO pairs.
applied_in:
  - title: "Folding design (3D fabrication)"
    href: ../../domains/3d-fabrication/aspects/folding-design.md
  - title: "Design, CAD & fabrication (area)"
    href: ../../areas/design-cad-fabrication.md
---

# 🗺️ Geometric Folding (6.849)

> Atomic concept nodes from MIT 6.849. Each links to its English note; every note has a Korean pair (`.ko`). Course: <span class="wl-missing" title="not published">6.849</span>.


## Origami & Flat Folding

- [Crease Pattern](/portfolio/study/crease-pattern/) · _The flat diagram of all fold lines drawn on the unfolded sheet of paper._  (L2,3)
- [Mountain–Valley Assignment](/portfolio/study/mountain-valley-assignment/) · _A labeling of every crease as a mountain (folds away) or valley (folds toward you)._  (L2,3)
- [Flat-Foldability](/portfolio/study/flat-foldability/) · _Whether a crease pattern can be folded into a flat (zero-thickness) state without the paper crossing itself._  (L2,3,7)
- [Simple Fold](/portfolio/study/simple-fold/) · _Folding all layers along one straight line by ±180°; the most restrictive, manufacturing-friendly fold model._  (L2)
- [Maekawa's Theorem](/portfolio/study/maekawa-theorem/) · _At every interior vertex of a flat-foldable crease pattern, #mountains − #valleys = ±2._  (L3)
- [Kawasaki's Theorem](/portfolio/study/kawasaki-theorem/) · _A single vertex of degree 2n folds flat iff its alternating angle sum is 0° — equivalently, odd-indexed angles sum to 180°._  (L3)
- [Single-Vertex Flat-Foldability](/portfolio/study/single-vertex-flat-foldability/) · _Deciding whether one interior vertex can fold flat — easy: check even degree, Kawasaki, Maekawa, and a layer-order pass._  (L3)
- [Big–Little–Big Lemma](/portfolio/study/big-little-big-lemma/) · _At a flat-foldable vertex, the crease inside a strictly-smallest angle (a local minimum) is forced to differ in M/V from its two neighbors._  (L3)
- [Map Folding](/portfolio/study/map-folding/) · _Given an m×n grid of creases with M/V labels, decide if it folds flat into a unit stack — easy in 1D, open/hard in general 2D._  (L2,7)
- [NP-Hardness of Flat Foldability](/portfolio/study/flat-foldability-np-hardness/) · _Deciding global flat-foldability of a given crease pattern is NP-hard (Bern & Hayes 1996), driven by the layer-ordering constraint._  (L7)
- [Tree Method (Origami Design)](/portfolio/study/tree-method/) · _Design an origami base by packing the legs of a stick-figure tree as circles/rivers on the square, then filling regions with molecules._  (L3,4,5)
- [Uniaxial Base](/portfolio/study/uniaxial-base/) · _A folded base whose flaps all lie perpendicular to a single line (axis), so its shadow is exactly a tree._  (L3,4)
- [Universal Molecule](/portfolio/study/universal-molecule/) · _An algorithm that fills a convex polygon (from the tree-method packing) with creases that fold it into the required uniaxial flaps._  (L4)
- [Box Pleating & Universal Hinge Patterns](/portfolio/study/box-pleating/) · _Designing on a 45°/90° grid so a single fixed hinge pattern can fold any cube-complex (polycube) shape._  (L4,7)
- [Fold-and-One-Cut](/portfolio/study/fold-and-one-cut/) · _Fold a sheet flat so that a single straight cut produces any desired arrangement of polygons / line drawing._  (L8)
- [Pleat Folding & the Hyperbolic Paraboloid](/portfolio/study/hypar-pleat-folding/) · _The classic concentric-square 'hypar' model provably cannot fold without extra creases — straight creases stay straight and flat polygons stay flat._  (L9)
- [Rigid Origami](/portfolio/study/rigid-origami/) · _Folding where faces stay rigid (flat) and only the creases move — the model for stiff materials, self-folding sheets, and architecture._  (L6,9)

## Linkages

- [Linkage](/portfolio/study/linkage/) · _A collection of fixed-length bars joined at hinges (a graph with edge lengths); the basic object of linkage folding._  (L10)
- [Configuration Space](/portfolio/study/configuration-space/) · _The space of all valid placements of a linkage; folding motions are paths in it, and 'locked' means a disconnected component._  (L10)
- [Kempe's Universality Theorem](/portfolio/study/kempe-universality-theorem/) · _There is a linkage whose tracing joint draws any given polynomial (algebraic) curve — 'a linkage to sign your name'._  (L10)
- [Rigidity (Generic & Minimal)](/portfolio/study/rigidity/) · _A framework is rigid if its only motions are trivial (rotations/translations); rigidity theory characterizes which graphs are rigid._  (L11)
- [Laman's Theorem](/portfolio/study/laman-theorem/) · _A graph is minimally generically rigid in 2D iff it has 2n−3 edges and every k-vertex subset spans at most 2k−3 edges._  (L11)
- [Infinitesimal Rigidity](/portfolio/study/infinitesimal-rigidity/) · _A linear-algebra test: a framework is infinitesimally rigid if the rigidity matrix admits only trivial velocity assignments._  (L12)
- [Tensegrity](/portfolio/study/tensegrity/) · _A framework with struts (can't shrink), cables (can't grow), and bars (fixed); stabilized by an equilibrium stress._  (L12)
- [Carpenter's Rule Theorem](/portfolio/study/carpenters-rule-theorem/) · _Any planar open chain or simple polygon can be straightened/convexified without self-intersection — 2D chains never lock._  (L12)
- [Locked Linkage](/portfolio/study/locked-linkage/) · _A linkage stuck in a configuration it can't continuously move out of (to straighten/convexify) without self-crossing._  (L13)
- [Pointed Pseudotriangulation](/portfolio/study/pseudotriangulation/) · _A planar subdivision into pseudotriangles (3 convex corners) with every vertex pointed; its mechanics drive the carpenter's-rule unfolding._  (L13)
- [Hinged Dissection](/portfolio/study/hinged-dissection/) · _A chain of polygons hinged at vertices that can refold to form any of several target shapes; such universal dissections always exist._  (L14)
- [Fixed-Angle Linkage (Protein Folding)](/portfolio/study/fixed-angle-linkage/) · _A 3D linkage where both bar lengths and the angles between consecutive bars are fixed; models protein backbones._  (L20)
- [HP Model of Protein Folding](/portfolio/study/hp-model/) · _A lattice model where amino acids are Hydrophobic or Polar; the optimal (max H–H contacts) folding is NP-complete._  (L21)

## Polyhedra: Folding & Unfolding

- [Polyhedron Unfolding](/portfolio/study/polyhedron-unfolding/) · _Cutting a polyhedron's surface so it unfolds flat into one non-overlapping piece (a net)._  (L15)
- [Edge Unfolding](/portfolio/study/edge-unfolding/) · _Unfolding where all cuts run along polyhedron edges; existence for all convex polyhedra is a famous open problem._  (L15,16)
- [General Unfolding (Source & Star)](/portfolio/study/general-unfolding/) · _Unfolding with cuts allowed across faces; convex polyhedra always have one via the source or star unfolding._  (L15)
- [Vertex Unfolding](/portfolio/study/vertex-unfolding/) · _A relaxed unfolding where pieces may stay connected only at single vertices (like a hinged chain of faces)._  (L16)
- [Cauchy's Rigidity Theorem](/portfolio/study/cauchy-rigidity-theorem/) · _A convex polyhedron is uniquely determined (up to congruence) by its faces and how they're glued — convex polyhedra are rigid._  (L16)
- [Alexandrov's Theorem](/portfolio/study/alexandrov-theorem/) · _Any convex polyhedral metric on a sphere is realized by a unique convex polyhedron — so a valid gluing of a polygon folds to exactly one convex solid._  (L16,17,18)
- [Gluing Tree](/portfolio/study/gluing-tree/) · _A combinatorial description of how a polygon's boundary is glued to itself; the search structure for finding Alexandrov gluings._  (L17,18)
- [D-Form](/portfolio/study/d-form/) · _A smooth convex surface made by gluing the perimeters of two convex curves of equal length._  (L17,19)
- [Dehn Invariant](/portfolio/study/dehn-invariant/) · _An algebraic quantity (from edge lengths and dihedral angles) that must match for two 3D polyhedra to be scissors-congruent._  (L14)

## Simulation (implemented in /simulator)

- [Compliant Fold Simulation](/portfolio/study/compliant-fold-simulation/) · _Folding as spring-mass relaxation toward crease target angles — all creases fold simultaneously (Ghassaei 7OSME / Schenk–Guest)._
- [Crease Torsional Spring](/portfolio/study/crease-torsional-spring/) · _The 4-node hinge stencil: torque K·(target − θ) at the apexes along face normals, reactions split over the crease endpoints._
- [Axial Springs & Time Step](/portfolio/study/axial-spring-and-timestep/) · _K = EA/L₀ edge springs with near-critical damping; stable dt = 0.9/(2π·√(K_max/m))._
- [SVG Crease Pattern Format](/portfolio/study/svg-crease-pattern-format/) · _Stroke color = crease type, stroke opacity = fold angle/180° — the round-trippable interchange convention._
- [Crease Pattern Import Pipeline](/portfolio/study/crease-pattern-import-pipeline/) · _Drawing → fold graph: merge, split crossings/T-junctions, trace planar faces, triangulate._

---
*Korean entry point:* each concept's Korean note is `<slug>.ko`.
