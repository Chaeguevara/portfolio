# B4 첫 슬라이스 + 랜딩 "Fold Journey" — 설계

날짜: 2026-07-03 · 상태: 사용자 승인 대기
관련: SPEC.md §0 북극성 2축, §4 접기 엔진, §12 B4

## 배경

SPEC B4 는 origamisimulator.org 급 compliant 접기 엔진을 4단계로 명세한다.
사용자 결정 두 가지:

1. **Solver-first 슬라이스** — FOLD import + CPU compliant solver + fold
   슬라이더를 designer 에서. SVG import / export 는 다음 슬라이스.
2. **랜딩 "Fold Journey"** — 현재 홈(핀휠 접기)은 서사가 없어 지루함.
   로드 시 짧은 스토리 시퀀스를 추가한다.

## 1부. Compliant solver (B4 stage 1–2 슬라이스)

### 모델 선택

Schenk & Guest 스프링-질량 모델 (origami simulator 와 동일), CPU 구현.

- 시트를 삼각화 → 모든 edge = axial 스프링.
- Crease edge = torsional 스프링, 목표각 `foldPercent × targetAngle`
  (M = −π, V = +π, `edges_foldAngle` 있으면 그 값).
- 삼각화가 만든 facet edge = 목표각 0 의 뻣뻣한 torsional 스프링 (면 굽힘 저항).
- Velocity Verlet + damping 으로 매 프레임 수 스텝 적분.

기각한 대안: Tachi 정밀 rigid 기구학 (rigid-foldable 아닌 패턴에서 실패),
GPU 즉시 구현 (수백 노드 CP 는 CPU 60fps 충분 — 구조는 GPU 포팅 가능하게 유지).

### 새 파일 (`src/app/fold/`, 기존 rigid 엔진은 그대로)

| 파일 | 역할 |
|---|---|
| `foldFile.ts` | FOLD JSON (`vertices_coords`, `edges_vertices`, `edges_assignment` M/V/B/F, `edges_foldAngle?`, `faces_vertices`) → SolverInput. convex fan 삼각화, facet edge 는 `F`. earcut 은 실제 패턴이 깨질 때 추가. |
| `solver.ts` | **THREE 비의존** typed-array solver. `createSolver(input, params)` → `{ positions: Float32Array, setFoldPercent(t∈[−1,1]), step(n), params }`. params = axial/crease/facet 강성 + damping (= "재질"). |

### Designer 통합

- lil-gui (기존 의존성): fold-percent 슬라이더, 강성 3종 + damping.
- 패턴 선택: 내장 예제 2개 (홈 단일 정점 패턴의 FOLD 변환본, bird base)
  + `.fold` 파일 업로드.
- 렌더: solver 의 `positions` Float32Array 를 BufferGeometry 가 공유,
  매 프레임 `needsUpdate`.

### 검증

`npm run check:fold` — node 스크립트: 단일 정점 패턴을 100% 접고
(1) NaN 없음 (2) crease dihedral 이 목표각 근방 수렴 assert.

### 비범위 (이번 슬라이스)

SVG import, STL/OBJ/FOLD export, strain 시각화, GPU, 곡선 crease.

## 2부. 랜딩 "Fold Journey"

로드 시 ~8초 스토리 시퀀스. 논지 = "알고리즘 → 종이 → 공간".

### 비트 (elapsed-time 상태기계, 라이브러리 없음, `home.ts` 내부)

1. **빈 시트** — 흰 종이만.
2. **Crease 선이 그려짐** — M 빨강 / V 파랑 선이 순차 드로우-인.
3. **이론 캡션** — troika 소형 라벨: "Kawasaki: 90°+90° = 180° ✓",
   "Maekawa: 3M − 1V = 2 ✓ → 평평하게 접힌다는 증명". 페이드 인/아웃.
4. **접힘** — 시트가 접혀 현재 내비 상태(방 패널)로 정착.

### 규칙

- **스킵**: 클릭/스크롤/키 입력 → 즉시 최종 상태로 점프.
- **`prefers-reduced-motion`**: 시퀀스 생략, 바로 최종 상태.
- 지금은 rigid 엔진으로 구동. solver 가 안정되면 랜딩 접힘을 실제
  시뮬레이션으로 교체 (1부와의 접점 — 별도 작업).

## 구현 순서

1부 (solver) → 2부 (fold journey). 서로 독립적이라 순서 교체 가능하나,
1부가 SPEC 북극성 직결이므로 먼저.
