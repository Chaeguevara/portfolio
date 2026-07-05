import type { FoldPattern } from './svgImport';
import type { SolverParams } from './solver';

/**
 * Material / thickness model for the fold simulator. Origami Simulator is
 * zero-thickness; real stock has thickness t, which (1) stiffens the fold, and
 * (2) STOPS the crease before a flat fold — thick slabs collide at the crease
 * (ontology thick-foldability). Each preset maps to solver stiffness + a
 * thickness-derived MAX fold angle, so cardboard folds rounder and less far than
 * paper. Grounded numbers from material-constraints; the fold cap is a calibrated
 * heuristic on the neutral-axis collision (exact per-crease collision = future).
 */
export interface Material {
  id: string;
  label: string;
  thickness: number; // mm
  color: string; // render tint
  solver: SolverParams; // stiffness the compliant solver runs at
}

/** Max dihedral (deg) a sheet of thickness t can fold to before slabs collide. */
export function foldCapDeg(t: number): number {
  // paper (t→0) → 180°; thicker → less. Bend radius ≈ t ⇒ the crease rounds and
  // the reachable angle drops. Calibrated: 0.1mm≈180, 2mm≈150, 3mm≈135; floor 70.
  return Math.max(70, Math.min(180, 180 - 15 * t));
}

export const MATERIALS: Material[] = [
  { id: 'paper', label: 'Paper (0.1 mm)', thickness: 0.1, color: '#f2efe6', solver: { axialStiffness: 20, creaseStiffness: 0.7, panelStiffness: 0.7, damping: 0.45 } },
  { id: 'cardstock', label: 'Cardstock (0.3 mm)', thickness: 0.3, color: '#efe3c8', solver: { axialStiffness: 22, creaseStiffness: 1.0, panelStiffness: 1.2, damping: 0.45 } },
  { id: 'cardboard', label: 'Cardboard (2 mm)', thickness: 2.0, color: '#c8a878', solver: { axialStiffness: 28, creaseStiffness: 2.2, panelStiffness: 3.5, damping: 0.55 } },
  { id: 'polypropylene', label: 'Polypropylene (0.8 mm)', thickness: 0.8, color: '#dfe7ee', solver: { axialStiffness: 24, creaseStiffness: 0.5, panelStiffness: 2.0, damping: 0.5 } },
  { id: 'plywood', label: 'Plywood (3 mm)', thickness: 3.0, color: '#c79b62', solver: { axialStiffness: 34, creaseStiffness: 3.5, panelStiffness: 6.0, damping: 0.6 } },
];

export function getMaterial(id: string): Material {
  return MATERIALS.find((m) => m.id === id) ?? MATERIALS[0];
}

/** Clamp every crease's target angle to ±cap so thick stock can't over-fold. */
export function capFoldAngles(pattern: FoldPattern, capDeg: number): FoldPattern {
  const edges = pattern.edges.map((e) => {
    if ((e.assignment === 'M' || e.assignment === 'V') && e.targetAngle != null) {
      const a = Math.max(-capDeg, Math.min(capDeg, e.targetAngle));
      return { ...e, targetAngle: a };
    }
    return e;
  });
  return { ...pattern, edges };
}
