/**
 * Shared crease-pattern catalog — the single source of truth for the example
 * patterns offered by BOTH the Lab (`/lab`, CASES dropdown) and the Simulator
 * (`/simulator`, pattern <select>). `file` is the path under public/patterns/**;
 * both pages load `${BASE_URL}patterns/${file}` and fold it with the same solver.
 *
 * Most patterns are origamisimulator.org's (MIT — see public/patterns/ATTRIBUTION.md);
 * `tessellations/yoshimura.svg` is generated in this repo.
 */
export interface PatternItem {
  file: string;
  label: string;
}
export interface PatternGroup {
  group: string;
  items: PatternItem[];
}

/** Pattern loaded on first open (both pages). */
export const DEFAULT_PATTERN = 'bases/birdBase.svg';

export const PATTERN_CASES: PatternGroup[] = [
  {
    // Default-parameter instances of the Lab Foundry generators (scripts/gen-patterns.mjs).
    group: 'Generated (Foundry)',
    items: [
      { file: 'generated/yoshimura.svg', label: 'Yoshimura barrel' },
      { file: 'generated/kresling.svg', label: 'Kresling twist' },
      { file: 'generated/miuraTube.svg', label: 'Miura tube' },
      { file: 'generated/waterbomb.svg', label: 'Waterbomb tessellation' },
      { file: 'generated/gluelessBox.svg', label: 'Glueless carton' },
    ],
  },
  {
    group: 'Simple folds',
    items: [
      { file: 'simple/simpleVertex.svg', label: 'Single Vertex' },
      { file: 'simple/mapfold.svg', label: 'Map Fold' },
      { file: 'simple/brochurefold.svg', label: 'Brochure Fold' },
      { file: 'simple/russianTriangle.svg', label: 'Russian Triangle' },
    ],
  },
  {
    group: 'Kirigami (cuts)',
    items: [
      { file: 'kirigami/honeycomb.svg', label: 'Honeycomb Kirigami' },
      { file: 'kirigami/miyamoto_tower.svg', label: 'Miyamoto Tower' },
    ],
  },
  {
    group: 'Tessellations',
    items: [
      { file: 'tessellations/yoshimura.svg', label: 'Yoshimura (folds to cylinder)' },
      { file: 'kirigami/tri_perf_tess.svg', label: 'Triangle Perforation (fold tessellation)' },
      { file: 'tessellations/miura-ori.svg', label: 'Miura-ori' },
      { file: 'tessellations/miura_sharpangle.svg', label: 'Miura (sharp angle)' },
      { file: 'tessellations/waterbomb.svg', label: 'Waterbomb Tessellation' },
      { file: 'tessellations/huffman_waterbomb.svg', label: 'Huffman Waterbomb' },
      { file: 'tessellations/huffman_rectangular_weave.svg', label: 'Huffman Rectangular Weave' },
      { file: 'tessellations/resch_tri.svg', label: 'Resch Triangle Tessellation' },
      { file: 'tessellations/whirlpool.svg', label: 'Whirlpool' },
      { file: 'tessellations/lang_honeycomb.svg', label: 'Lang Honeycomb' },
    ],
  },
  {
    group: 'Bases',
    items: [
      { file: 'bases/birdBase.svg', label: 'Bird Base' },
      { file: 'bases/waterbombBase.svg', label: 'Waterbomb Base' },
      { file: 'bases/frogBase.svg', label: 'Frog Base' },
      { file: 'bases/squareBase.svg', label: 'Square Base' },
      { file: 'bases/boatBase.svg', label: 'Boat Base' },
      { file: 'bases/openSinkBase.svg', label: 'Open Sink Base' },
      { file: 'bases/pinwheelBase.svg', label: 'Pinwheel Base' },
    ],
  },
  {
    group: 'Origami',
    items: [
      { file: 'origami/randlettflappingbird.svg', label: 'Flapping Bird (Randlett)' },
      { file: 'origami/flappingBird.svg', label: 'Flapping Bird' },
      { file: 'origami/traditionalCrane.svg', label: 'Traditional Crane' },
      { file: 'origami/flat_crane.svg', label: 'Flat Crane' },
      { file: 'origami/singlesquaretwist.svg', label: 'Square Twist' },
      { file: 'origami/square_twist_many_angles.svg', label: 'Square Twist (many angles)' },
      { file: 'origami/airplane.svg', label: 'Airplane' },
      { file: 'origami/hypar.svg', label: 'Hypar' },
      { file: 'origami/6pt_hypar_anti.svg', label: '6-point Hypar' },
    ],
  },
  {
    group: 'Pop-up',
    items: [
      { file: 'popup/simple.svg', label: 'Simple Pop-up' },
      { file: 'popup/house.svg', label: 'House' },
      { file: 'popup/geometric.svg', label: 'Geometric' },
      { file: 'popup/castle.svg', label: 'Castle' },
    ],
  },
  {
    group: 'Polygami · Unfolding',
    items: [
      { file: 'polygami/polygami.svg', label: 'Polygami' },
      { file: 'polygami/cross.svg', label: 'Polygami Cross' },
      { file: 'unfolding/cube.svg', label: 'Cube Unwrapping' },
    ],
  },
  {
    group: 'Square maze',
    items: [
      { file: 'maze/cross.svg', label: 'Cross' },
      { file: 'maze/helloworld.svg', label: 'Hello World' },
      { file: 'maze/origamisimulator.svg', label: '"origamisimulator"' },
    ],
  },
  {
    group: 'Problematic (needs collisions)',
    items: [
      { file: 'problematic/rose.svg', label: 'Rose' },
      { file: 'problematic/byu solar driven.svg', label: 'BYU Solar Array' },
    ],
  },
];
