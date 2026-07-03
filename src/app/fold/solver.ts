/**
 * CPU compliant origami solver — a TypeScript port of the dynamic solver in
 * Amanda Ghassaei's Origami Simulator (MIT, github.com/amandaghassaei/OrigamiSimulator).
 * Same physics, same defaults; runs on typed arrays instead of GPU textures.
 *
 *   - every edge is an axial spring:  K = axialStiffness / L0,
 *     D = damping · 2·√(K·m), F = K·Δx + D·Δv   (m = 1 for every node)
 *   - every M/V/F edge is a torsional spring on its two adjacent triangles:
 *     K = stiffness · L0, torque ∝ K·(percent·target − θ), applied at the two
 *     apex nodes along face normals (moment arm = apex height) with reactions
 *     split over the edge nodes by projection ratio
 *   - semi-implicit Euler, dt = 0.9 / (2π·√(Kmax/m))
 *
 * THREE-free on purpose: runs under plain node for self-checks.
 * ponytail: no face-angle (anti-shear) term — triangles are already near-rigid
 * from their three axial springs; add faceStiffness if shear drift shows up.
 */

export type EdgeKind = 'B' | 'M' | 'V' | 'F' | 'U' | 'C';

export interface SolverInput {
  /** Flat 2D vertex positions. */
  vertices: [number, number][];
  /** CCW triangles. */
  faces: [number, number, number][];
  /** All edges (borders included). targetAngle in degrees for M/V/F. */
  edges: { v1: number; v2: number; assignment: EdgeKind; targetAngle: number | null }[];
}

export interface SolverParams {
  axialStiffness: number; // EA
  creaseStiffness: number; // fold creases (M/V), × length
  panelStiffness: number; // facet diagonals (F), × length
  damping: number; // damping ratio ζ
}

export const DEFAULT_PARAMS: SolverParams = {
  axialStiffness: 20,
  creaseStiffness: 0.7,
  panelStiffness: 0.7,
  damping: 0.45,
};

export interface Solver {
  /** xyz per vertex — shared with the render mesh. */
  positions: Float32Array;
  readonly vertexCount: number;
  params: SolverParams;
  /** Fold fraction in [-1, 1]; negative flips every mountain/valley. */
  setFoldPercent(p: number): void;
  /** Advance n substeps. */
  step(n: number): void;
  /** Mean |axial strain| over all beams — cheap convergence/quality signal. */
  strain(): number;
  /** Back to the flat sheet, zero velocity. */
  reset(): void;
  /** Recompute stiffness-derived quantities after params change. */
  refresh(): void;
}

export function createSolver(input: SolverInput, params: SolverParams = { ...DEFAULT_PARAMS }): Solver {
  const N = input.vertices.length;
  const positions = new Float32Array(N * 3);
  const velocities = new Float32Array(N * 3);
  const original = new Float32Array(N * 3);
  input.vertices.forEach(([x, y], i) => {
    original[i * 3] = x;
    original[i * 3 + 1] = y;
  });
  positions.set(original);

  // ---- beams (every edge) ----
  const B = input.edges.length;
  const bV1 = new Int32Array(B);
  const bV2 = new Int32Array(B);
  const bL0 = new Float32Array(B);
  const bK = new Float32Array(B);
  const bD = new Float32Array(B);
  input.edges.forEach((e, i) => {
    bV1[i] = e.v1;
    bV2[i] = e.v2;
    const dx = input.vertices[e.v2][0] - input.vertices[e.v1][0];
    const dy = input.vertices[e.v2][1] - input.vertices[e.v1][1];
    bL0[i] = Math.hypot(dx, dy);
  });

  // ---- creases (M/V/F edges with two adjacent faces) ----
  // face lookup per undirected edge
  const facesOfEdge = new Map<string, number[]>();
  input.faces.forEach((f, fi) => {
    for (let k = 0; k < 3; k++) {
      const a = f[k];
      const b = f[(k + 1) % 3];
      const key = a < b ? `${a},${b}` : `${b},${a}`;
      if (!facesOfEdge.has(key)) facesOfEdge.set(key, []);
      facesOfEdge.get(key)!.push(fi);
    }
  });

  interface CreaseRec {
    v3: number; // edge start
    v4: number; // edge end
    face1: number; // triangle left of v3→v4 (contains directed edge v3,v4)
    face2: number;
    apex1: number;
    apex2: number;
    L0: number;
    fold: boolean; // fold crease vs facet panel
    target: number; // full-fold dihedral, radians, signed
    k: number;
    theta: number; // last dihedral (for unwrap)
  }
  const creases: CreaseRec[] = [];
  input.edges.forEach((e) => {
    if (e.assignment !== 'M' && e.assignment !== 'V' && e.assignment !== 'F') return;
    const key = e.v1 < e.v2 ? `${e.v1},${e.v2}` : `${e.v2},${e.v1}`;
    const adj = facesOfEdge.get(key);
    if (!adj || adj.length !== 2) return; // boundary or broken — no hinge
    // Orient so face1 contains the directed edge v3→v4 (lies to its left).
    let [f1, f2] = adj;
    const has = (fi: number, a: number, b: number) => {
      const f = input.faces[fi];
      return (
        (f[0] === a && f[1] === b) ||
        (f[1] === a && f[2] === b) ||
        (f[2] === a && f[0] === b)
      );
    };
    let v3 = e.v1;
    let v4 = e.v2;
    if (!has(f1, v3, v4)) [f1, f2] = [f2, f1];
    if (!has(f1, v3, v4)) {
      [v3, v4] = [v4, v3];
      if (!has(f1, v3, v4)) [f1, f2] = [f2, f1];
    }
    const apexOf = (fi: number) => input.faces[fi].find((v) => v !== v3 && v !== v4)!;
    const dx = input.vertices[v4][0] - input.vertices[v3][0];
    const dy = input.vertices[v4][1] - input.vertices[v3][1];
    creases.push({
      v3,
      v4,
      face1: f1,
      face2: f2,
      apex1: apexOf(f1),
      apex2: apexOf(f2),
      L0: Math.hypot(dx, dy),
      fold: e.assignment !== 'F',
      target: ((e.targetAngle ?? 0) * Math.PI) / 180,
      k: 0,
      theta: 0,
    });
  });

  // ---- face normals scratch ----
  const F = input.faces.length;
  const fN = new Float32Array(F * 3);
  const forces = new Float32Array(N * 3);

  let dt = 0;
  let foldPercent = 0;

  function refresh() {
    let maxK = 0;
    for (let i = 0; i < B; i++) {
      bK[i] = params.axialStiffness / bL0[i];
      bD[i] = params.damping * 2 * Math.sqrt(bK[i]); // node mass = 1
      if (bK[i] > maxK) maxK = bK[i];
    }
    for (const c of creases) {
      c.k = (c.fold ? params.creaseStiffness : params.panelStiffness) * c.L0;
    }
    dt = (1 / (2 * Math.PI * Math.sqrt(maxK))) * 0.9;
  }
  refresh();

  function computeNormals() {
    for (let fi = 0; fi < F; fi++) {
      const [a, b, c] = input.faces[fi];
      const ax = positions[a * 3];
      const ay = positions[a * 3 + 1];
      const az = positions[a * 3 + 2];
      const ux = positions[b * 3] - ax;
      const uy = positions[b * 3 + 1] - ay;
      const uz = positions[b * 3 + 2] - az;
      const vx = positions[c * 3] - ax;
      const vy = positions[c * 3 + 1] - ay;
      const vz = positions[c * 3 + 2] - az;
      let nx = uy * vz - uz * vy;
      let ny = uz * vx - ux * vz;
      let nz = ux * vy - uy * vx;
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len;
      ny /= len;
      nz /= len;
      fN[fi * 3] = nx;
      fN[fi * 3 + 1] = ny;
      fN[fi * 3 + 2] = nz;
    }
  }

  function substep() {
    forces.fill(0);
    computeNormals();

    // crease torsional forces
    for (const c of creases) {
      const p3 = c.v3 * 3;
      const p4 = c.v4 * 3;
      let ex = positions[p4] - positions[p3];
      let ey = positions[p4 + 1] - positions[p3 + 1];
      let ez = positions[p4 + 2] - positions[p3 + 2];
      const creaseLen = Math.hypot(ex, ey, ez);
      if (creaseLen < 1e-6) continue;
      ex /= creaseLen;
      ey /= creaseLen;
      ez /= creaseLen;
      const n1x = fN[c.face1 * 3];
      const n1y = fN[c.face1 * 3 + 1];
      const n1z = fN[c.face1 * 3 + 2];
      const n2x = fN[c.face2 * 3];
      const n2y = fN[c.face2 * 3 + 1];
      const n2z = fN[c.face2 * 3 + 2];
      // theta = atan2(dot(cross(n1,e),n2), dot(n1,n2)), unwrapped
      const cx = n1y * ez - n1z * ey;
      const cy = n1z * ex - n1x * ez;
      const cz = n1x * ey - n1y * ex;
      let theta = Math.atan2(cx * n2x + cy * n2y + cz * n2z, n1x * n2x + n1y * n2y + n1z * n2z);
      const diff = theta - c.theta;
      if (diff < -5) theta += 2 * Math.PI;
      else if (diff > 5) theta -= 2 * Math.PI;
      c.theta = theta;

      const angForce = c.k * (c.target * (c.fold ? foldPercent : 1) - theta);

      // apex moment arms and projection coefficients
      const proj = (vi: number) => {
        const dx = positions[vi * 3] - positions[p3];
        const dy = positions[vi * 3 + 1] - positions[p3 + 1];
        const dz = positions[vi * 3 + 2] - positions[p3 + 2];
        const t = dx * ex + dy * ey + dz * ez;
        const h = Math.sqrt(Math.max(dx * dx + dy * dy + dz * dz - t * t, 0));
        return { t, h };
      };
      const q1 = proj(c.apex1);
      const q2 = proj(c.apex2);
      if (q1.h < 1e-6 || q2.h < 1e-6) continue;
      const coef1 = q1.t / creaseLen;
      const coef2 = q2.t / creaseLen;

      const a1 = c.apex1 * 3;
      const a2 = c.apex2 * 3;
      const f1 = angForce / q1.h;
      const f2 = angForce / q2.h;
      forces[a1] += f1 * n1x;
      forces[a1 + 1] += f1 * n1y;
      forces[a1 + 2] += f1 * n1z;
      forces[a2] += f2 * n2x;
      forces[a2 + 1] += f2 * n2y;
      forces[a2 + 2] += f2 * n2z;
      const r3x = -((1 - coef1) * f1 * n1x + (1 - coef2) * f2 * n2x);
      const r3y = -((1 - coef1) * f1 * n1y + (1 - coef2) * f2 * n2y);
      const r3z = -((1 - coef1) * f1 * n1z + (1 - coef2) * f2 * n2z);
      forces[p3] += r3x;
      forces[p3 + 1] += r3y;
      forces[p3 + 2] += r3z;
      forces[p4] -= coef1 * f1 * n1x + coef2 * f2 * n2x;
      forces[p4 + 1] -= coef1 * f1 * n1y + coef2 * f2 * n2y;
      forces[p4 + 2] -= coef1 * f1 * n1z + coef2 * f2 * n2z;
    }

    // axial springs
    for (let i = 0; i < B; i++) {
      const i1 = bV1[i] * 3;
      const i2 = bV2[i] * 3;
      const dx = positions[i2] - positions[i1];
      const dy = positions[i2 + 1] - positions[i1 + 1];
      const dz = positions[i2 + 2] - positions[i1 + 2];
      const len = Math.hypot(dx, dy, dz) || 1e-12;
      const s = bK[i] * (len - bL0[i]);
      const dvx = velocities[i2] - velocities[i1];
      const dvy = velocities[i2 + 1] - velocities[i1 + 1];
      const dvz = velocities[i2 + 2] - velocities[i1 + 2];
      const ux = dx / len;
      const uy = dy / len;
      const uz = dz / len;
      const fx = s * ux + bD[i] * dvx;
      const fy = s * uy + bD[i] * dvy;
      const fz = s * uz + bD[i] * dvz;
      forces[i1] += fx;
      forces[i1 + 1] += fy;
      forces[i1 + 2] += fz;
      forces[i2] -= fx;
      forces[i2 + 1] -= fy;
      forces[i2 + 2] -= fz;
    }

    // symplectic Euler (mass = 1)
    for (let i = 0; i < N * 3; i++) {
      velocities[i] += forces[i] * dt;
      positions[i] += velocities[i] * dt;
    }
  }

  return {
    positions,
    vertexCount: N,
    params,
    setFoldPercent(p) {
      foldPercent = Math.max(-1, Math.min(1, p));
    },
    step(n) {
      for (let i = 0; i < n; i++) substep();
    },
    strain() {
      let sum = 0;
      for (let i = 0; i < B; i++) {
        const i1 = bV1[i] * 3;
        const i2 = bV2[i] * 3;
        const len = Math.hypot(
          positions[i2] - positions[i1],
          positions[i2 + 1] - positions[i1 + 1],
          positions[i2 + 2] - positions[i1 + 2],
        );
        sum += Math.abs(len / bL0[i] - 1);
      }
      return B ? sum / B : 0;
    },
    reset() {
      positions.set(original);
      velocities.fill(0);
      creases.forEach((c) => (c.theta = 0));
    },
    refresh,
  };
}
