---
type: map
title: Geometric Fabrication
summary: Cross-course study map for fabrication — folding theory (6.849) + the linear algebra (18.06) and algorithmic foundations (6.006/6.046J/6.042J) it runs on.
related:
  - "[[geometric-folding]]"
  - "[[linear-algebra]]"
  - "[[algorithms]]"
  - "[[advanced-algorithms]]"
  - "[[math-for-cs]]"
---

# 🛠️ Geometric Fabrication — Cross-Course Study Map

> The fabrication lens: design a foldable/deployable object, prove it works, cut it from
> sheet. 6.849 supplies the geometry; 18.06 supplies the machinery (rigidity = rank +
> nullspace); the algorithms courses supply the computational thinking. Sources & study
> order: <span class="wl-missing" title="not published">geometric-fabrication-sources</span>. Full per-course maps: [Geometric Folding](/portfolio/study/maps/geometric-folding/),
> [Linear Algebra](/portfolio/study/maps/linear-algebra/), [Algorithms](/portfolio/study/maps/algorithms/), [Design and Analysis of Algorithms](/portfolio/study/maps/advanced-algorithms/), [Mathematics for Computer Science](/portfolio/study/maps/math-for-cs/).

## 1. Design the crease pattern (6.849 origami pillar)

- [Crease Pattern](/portfolio/study/crease-pattern/) · [Mountain–Valley Assignment](/portfolio/study/mountain-valley-assignment/) — the design artifact and its labeling
- [Simple Fold](/portfolio/study/simple-fold/) — the machine-foldable model; orthogonal patterns on rectangular stock stay linear-time
- [Single-Vertex Flat-Foldability](/portfolio/study/single-vertex-flat-foldability/) ← [Kawasaki's Theorem](/portfolio/study/kawasaki-theorem/) + [Maekawa's Theorem](/portfolio/study/maekawa-theorem/) + [Big–Little–Big Lemma](/portfolio/study/big-little-big-lemma/) — the local checks
- [NP-Hardness of Flat Foldability](/portfolio/study/flat-foldability-np-hardness/) — why you design *inside* universality constructions instead of solving foldability
- Constructions correct by construction: [Tree Method (Origami Design)](/portfolio/study/tree-method/) → [Uniaxial Base](/portfolio/study/uniaxial-base/) → [Universal Molecule](/portfolio/study/universal-molecule/); [Box Pleating & Universal Hinge Patterns](/portfolio/study/box-pleating/) (polycubes, universal hinge patterns); [Fold-and-One-Cut](/portfolio/study/fold-and-one-cut/)
- The stiff-material trap: [Pleat Folding & the Hyperbolic Paraboloid](/portfolio/study/hypar-pleat-folding/) — straight creases stay straight; triangulate or use curved creases

## 2. Prove it moves (only) as intended (6.849 linkages + 18.06)

- [Rigid Origami](/portfolio/study/rigid-origami/) — flat-foldable ≠ rigidly foldable (shopping bag); degree-4 vertices = 1-DOF workhorse
- [Rigidity (Generic & Minimal)](/portfolio/study/rigidity/) → [Laman's Theorem](/portfolio/study/laman-theorem/) (2D combinatorial answer; pebble game) → [Infinitesimal Rigidity](/portfolio/study/infinitesimal-rigidity/) (rigidity matrix, any dimension)
- Rigidity matrix *is* 18.06: [Rank](/portfolio/study/rank/) + [Nullspace N(A)](/portfolio/study/nullspace/) (motions/DOF), [The Four Fundamental Subspaces](/portfolio/study/four-fundamental-subspaces/) (left nullspace = self-stresses), [Incidence Matrices (Graphs & Networks)](/portfolio/study/incidence-matrix/) (combinatorial skeleton, loops = closure constraints)
- [Tensegrity](/portfolio/study/tensegrity/) — prestress lives in the left nullspace; stability via [Positive Definite Matrices](/portfolio/study/positive-definite/) stiffness ([Symmetric Matrices & the Spectral Theorem](/portfolio/study/symmetric-matrix/) spectral theorem; zero eigenvalue = mechanism)
- Deployment: [Carpenter's Rule Theorem](/portfolio/study/carpenters-rule-theorem/) (2D chains never lock) vs [Locked Linkage](/portfolio/study/locked-linkage/) (3D knitting needles); [Pointed Pseudotriangulation](/portfolio/study/pseudotriangulation/) (constructive 1-DOF expansive mechanisms); [Configuration Space](/portfolio/study/configuration-space/)
- Numerics: [Singular Value Decomposition (SVD)](/portfolio/study/singular-value-decomposition/) (mechanism modes, near-zero σ = almost-mechanisms, plane-fit flatness), [Pseudoinverse](/portfolio/study/pseudoinverse/) (min-norm actuation), [Least Squares](/portfolio/study/least-squares/) + [Projection onto a Subspace](/portfolio/study/projection/) (panel plane fitting, overdetermined closure), [Orthogonal Matrix](/portfolio/study/orthogonal-matrix/) + [Gram–Schmidt Orthogonalization](/portfolio/study/gram-schmidt/) (panel frames, rotations), [Change of Basis](/portfolio/study/change-of-basis/) (CP ↔ folded coordinates)

## 3. Unfold for cutting / fold from flat (6.849 polyhedra pillar)

- [Polyhedron Unfolding](/portfolio/study/polyhedron-unfolding/) — the convex/nonconvex × edge/general decision table
- [Edge Unfolding](/portfolio/study/edge-unfolding/) (heuristic + overlap check; open for convex) · [General Unfolding (Source & Star)](/portfolio/study/general-unfolding/) (source/star — guaranteed for convex) · [Vertex Unfolding](/portfolio/study/vertex-unfolding/) (triangulated anything, linear time)
- Reverse direction: [Cauchy's Rigidity Theorem](/portfolio/study/cauchy-rigidity-theorem/) (convex shells rigid for free) → [Alexandrov's Theorem](/portfolio/study/alexandrov-theorem/) (valid gluing ⇒ unique convex solid) → [Gluing Tree](/portfolio/study/gluing-tree/) (edge-to-edge gluings poly-time) → [D-Form](/portfolio/study/d-form/) (doubly-curved shells without dies)
- [Dehn Invariant](/portfolio/study/dehn-invariant/) — why 3D recut-and-reassemble fails; surface refolding is the alternative
- [Hinged Dissection](/portfolio/study/hinged-dissection/) — shape-shifting hardware; slender adornments never lock

## 4. Computational thinking underneath (6.006 / 6.046J / 6.042J)

- Classify first: [Computational Problems & Algorithms](/portfolio/study/computational-problem/) · [Complexity Classes: P, NP, EXP](/portfolio/study/complexity-classes/) · [NP-Completeness & Reductions](/portfolio/study/np-completeness/) · [Approximation Algorithms](/portfolio/study/approximation-algorithms/) · [Pseudopolynomial Time & Subset Sum](/portfolio/study/pseudopolynomial/) — NP-hard ⇒ restrict family / approximate / heuristic + cheap verification
- Graph thinking: [Graphs: Walks, Paths & Connectivity](/portfolio/study/graphs-basics/) · [Planar Graphs & Euler's Formula](/portfolio/study/planar-graphs/) (Euler formula = CP sanity check) · [Trees & Spanning Trees](/portfolio/study/trees-and-spanning-trees/) (choosing an unfolding = choosing a spanning tree of the face dual) · [Minimum Spanning Trees](/portfolio/study/minimum-spanning-tree/) (fold-tree selection) · [Union-Find (Disjoint Sets)](/portfolio/study/union-find/) (incremental connectivity of panels) · [Topological Sort](/portfolio/study/topological-sort/) (fold/assembly order; cycle = proof no order exists) · [Breadth-First Search (BFS)](/portfolio/study/breadth-first-search/) / [Depth-First Search (DFS)](/portfolio/study/depth-first-search/)
- Geometry + paths: [Dijkstra's Algorithm](/portfolio/study/dijkstra/) / [Weighted Shortest Paths: Overview](/portfolio/study/weighted-shortest-paths/) (continuous Dijkstra → source unfolding) · [Computational Geometry](/portfolio/study/computational-geometry/) (sweep = CP integrity + net overlap; hull = nesting; closest pair = min-feature vs kerf)
- Optimization: [Dynamic Programming (SRTBOT)](/portfolio/study/dynamic-programming/) (1D [Map Folding](/portfolio/study/map-folding/), gluing-tree DP) · [Greedy Algorithms & the Exchange Argument](/portfolio/study/greedy-algorithms/) (only with exchange argument) · [Network Flow & Max-Flow Min-Cut](/portfolio/study/network-flow/) / [Bipartite Matching & Hall's Theorem](/portfolio/study/bipartite-matching/) (parts→sheets, tabs→slots; Hall = infeasibility certificate) · [Randomized Algorithms](/portfolio/study/randomized-algorithms/) (perturb-then-rank-test rigidity)
- Verification: [Mathematical Induction](/portfolio/study/induction/) / [Strong Induction](/portfolio/study/strong-induction/) · [Invariants & State Machines](/portfolio/study/invariants-and-state-machines/) (fold step preserves isometry/area/angle invariants) · [Proof Methods](/portfolio/study/proof-methods/) · [Pigeonhole Principle](/portfolio/study/pigeonhole-principle/)

---
*Distilled into the Claude skill `geometric-folding-fabrication` (reference library:
design-algorithms, rigidity-linkages, polyhedra-unfolding, linear-algebra-toolkit,
algorithmic-foundations). Korean pairs: each concept's `.ko` note.*
