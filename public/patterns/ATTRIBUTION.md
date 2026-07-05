# Pattern attribution

The crease-pattern SVGs in this directory are vendored from
[Origami Simulator](https://github.com/amandaghassaei/OrigamiSimulator)
by Amanda Ghassaei (MIT License, © 2018 Amanda Ghassaei), with pattern
credits to their original designers (Randlett, Lang, Huffman, BYU, et al.)
as noted in that repository.

- simple/ — SimpleFolds
- bases/ — Bases
- origami/ — Origami
- kirigami/ — Kirigami (auxetic triangles, honeycomb, perforations, towers — cut patterns)
- tessellations/ — Tessellations (Miura, waterbomb, Huffman, Resch, Lang, whirlpool)
- popup/ — Popup
- polygami/ — Polygami
- unfolding/ — PolygonUnfolding
- maze/ — Squaremaze (maze folding)
- problematic/ — needsCollisions (patterns known to need collision handling)

Curved-crease patterns from the source are intentionally not vendored: this
port's SVG importer supports straight creases only (M/L/H/V/Z path commands).
