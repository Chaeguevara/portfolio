# Portfolio Spec — "Folded"

이 문서가 단일 진실 원본 (Single Source of Truth). 구조 변경 시 SPEC.md 부터 갱신 후 코드.

## 0. 한 줄 정의

포트폴리오 자체가 **한 장의 종이**다. 진짜 flat-foldable crease pattern (Kawasaki +
Maekawa 만족) 이 접히면서 그 면(face)들이 **방(room)** 이 된다 — works / about.
모든 시각·내비게이션은 **단일 full-screen `<canvas>` 안의 Three.js** 로 그린다.
DOM UI 없음. Astro 는 정적 셸을 굽는 빌드 도구일 뿐.

Erik Demaine 이 세 출처(6.849 folding · 6.006 algorithms · 6.042J math)의 공통
줄기이고, 그가 "알고리즘을 종이로 접는" 사람이라는 점이 컨셉의 근거다.
출처 지식은 [[geometric-folding]] 등 `src/content/study/` 노트로 이미 distill 됨 —
이 PRD 는 그 지식을 **코드(접기 엔진)** 와 **공간(방)** 으로 reflect 한다.

**북극성 (레포의 최종 목적) 두 축:**
1. **페이지 자체가 Three.js 네이티브** — 위 단일 캔버스 방향 (§1–§5, 진행 중).
2. **완전한 접기 엔진** — [origamisimulator.org](https://origamisimulator.org) 급
   시뮬레이션 (재질/강성 포함). 사용자가 만든 2D 레이아웃(crease pattern)을
   손으로 접을 수 있는 도면으로 뽑거나, 접힌 3D 형상을 모델링 툴 입력
   (STL/OBJ/FOLD) 으로 내보낼 수 있어야 한다. 현 rigid 엔진(§4)은 1단계,
   업그레이드 경로는 §12 B4.

## 1. 설계 결정 (확정)

| 항목 | 결정 |
| --- | --- |
| 셸 | **단일 캔버스, DOM UI 없음.** `index.astro` = `<canvas>` + boot script + 접근성용 숨김 시맨틱 DOM. |
| 내러티브 | **Folding-as-portfolio.** 종이가 접혀 rooms 로. Demaine-inspired. |
| 텍스트 | WebGL 안에서 렌더 (`troika-three-text`, SDF). 제목·라벨·본문 모두 3D. |
| 라우팅 | `/`, `/works`, `/about` = **캔버스 상태**(History API, 새로고침 없음). `/study/*`, `/designer` = **실제 HTML 페이지**로 hard navigation. |
| Study | 기존 markdown 페이지 **그대로 유지** (SEO/가독성). 캔버스가 link-out. |
| 접근성/SEO | `index.astro` 에 **visually-hidden 시맨틱 DOM** (real `<a>` + 본문 텍스트 + `<noscript>`). 캔버스는 `aria-hidden`. **콘텐츠는 이 숨김 DOM 에 1회 작성** → Three.js 앱이 DOM 에서 읽어 3D 로 렌더 (콘텐츠 단일 출처). |
| 접기 정확성 | crease pattern 은 **검증된 flat-foldable** 패턴. rigid origami 보간(면은 강체, crease 만 회전). |

## 2. 디렉터리 구조

```
portfolio/
├── src/
│   ├── pages/
│   │   ├── index.astro        # 캔버스 셸 + 숨김 시맨틱 DOM (콘텐츠 SSOT)
│   │   ├── study/             # ← 변경 없음 (markdown 컬렉션)
│   │   ├── designer.astro     # ← 유지 (crease-pattern lab, 이미 three.js)
│   │   └── 404.astro
│   ├── app/                   # 단일 캔버스 애플리케이션 (신규)
│   │   ├── main.ts            # boot: renderer, camera, loop, theme, router
│   │   ├── router.ts          # 가상 라우트 ↔ History API, deeplink, popstate
│   │   ├── content.ts         # 숨김 DOM → 구조화 콘텐츠 파싱
│   │   ├── fold/              # 접기 엔진 = 6.849 지식의 코드화
│   │   │   ├── creasePattern.ts  # 자료구조: vertices, creases, MV 배정
│   │   │   ├── foldMath.ts       # Kawasaki/Maekawa 검증 + dihedral 해
│   │   │   └── foldEngine.ts     # flat ↔ folded 보간 (rigid), Mesh 생성
│   │   ├── scenes/
│   │   │   ├── home.ts        # 접히는 종이 → rooms 진입
│   │   │   ├── works.ts       # works room
│   │   │   └── about.ts       # about room
│   │   └── ui/
│   │       ├── text.ts        # troika label/heading/body 헬퍼
│   │       └── raycastNav.ts  # pointer picking → 라우트 전이
│   ├── lib/theme.ts           # light/dark, --three-bg (유지)
│   ├── styles/                # 캔버스 fullscreen + .sr-only (대폭 축소)
│   └── content.config.ts      # study 컬렉션 (유지)
├── astro.config.mjs           # base '/portfolio/', static
└── .github/workflows/deploy.yml
```

**Deprecated (제거 대상):** 기존 `works/` 라우트·grid, `previews.ts`, `Nav.astro`,
`BaseLayout` 의 멀티페이지 chrome, `inProgress*`, `ProgressTracker`, OSM/terrain
계열 (`osmClient`/`elevationClient`/`game`/`planarGraph` 등 캔버스가 안 쓰는 것).
study·designer 가 쓰는 것은 보존. 구현 중 점진 삭제.

## 3. 라우트 계약

| URL | 산출물 | 종류 | 처리 |
| --- | --- | --- | --- |
| `/portfolio/` | `index.html` | 캔버스 홈 | 종이 flat → 접힘 idle |
| `/portfolio/works` | (캔버스 상태) | works room | History pushState, deeplink 시 초기 상태로 |
| `/portfolio/about` | (캔버스 상태) | about room | 동상 |
| `/portfolio/study/*` | `study/.../index.html` | markdown | 실제 페이지, hard nav |
| `/portfolio/designer` | `designer/index.html` | lab | 실제 페이지, hard nav |
| (그 외) | `404.html` | 404 | — |

`/works`·`/about` 는 빌드 산출 HTML 이 없다(캔버스 가상 상태). 단, deeplink·새로고침
대비로 **둘 다 `index.html` 로 서빙**되도록 셸이 처리: GitHub Pages 404 fallback 대신
`index.astro` 가 `/works`,`/about` 경로도 같은 셸을 내도록 빌드 시 정적 alias 생성
(`getStaticPaths` 로 `works/index.html`, `about/index.html` = 동일 셸). 앱이 부팅 시
`location.pathname` 읽어 해당 room 으로 초기화.

## 4. 접기 엔진 계약 (6.849 → 코드)

`src/app/fold/`. 이 모듈이 PRD 의 핵심이자 "지식 reflect" 의 증거.

```ts
// creasePattern.ts
interface Crease { v1: number; v2: number; assignment: 'M' | 'V' | 'B'; }  // B=border
interface CreasePattern {
  vertices: THREE.Vector2[];   // 평면(flat) 좌표
  creases: Crease[];
  faces: number[][];           // crease 그래프가 나눈 평면 영역 (vertex index 순환)
}

// foldMath.ts — 검증. 잘못된 패턴은 빌드/런타임에서 거부.
function kawasakiHolds(p: CreasePattern, vertex: number): boolean;  // 교번각 합 == 180°
function maekawaHolds(p: CreasePattern, vertex: number): boolean;   // |#M - #V| == 2
function isFlatFoldable(p: CreasePattern): boolean;                 // 모든 내부 vertex

// foldEngine.ts — rigid origami 보간.
//  t=0 평면, t=1 완전 접힘. 면은 강체, dihedral angle 만 시간축 보간.
function buildFoldMesh(p: CreasePattern): { mesh: THREE.Group; setFold(t: number): void };
```

- **방(room) ↔ face 매핑:** 접힌 형상의 특정 face 들이 works/about 패널. `home.ts`
  가 face → 라벨/카메라 타겟 연결.
- **검증 불변식:** 앱이 쓰는 패턴은 `isFlatFoldable === true`. 자체 점검(§9) 으로 보장.

## 5. 앱 모듈 계약

```ts
// main.ts: 단일 WebGLRenderer, perspective camera, RAF loop, theme 동기화.
//   캔버스 = #stage. resize/visibilitychange/contextlost 처리.
// router.ts:
type Route = 'home' | 'works' | 'about';
function initRouter(onEnter: (r: Route, viaHistory: boolean) => void): {
  go(r: Route): void;     // pushState + onEnter(r,false)
};  // popstate → onEnter(r,true). study/designer 링크는 location.href 로 hard nav.
// content.ts: #content(숨김 DOM) 파싱 → { about: {...}, works: [{title,body,href}] }
// ui/text.ts: makeLabel(text, opts), makeBody(html→plain, maxWidth) → troika Mesh
// ui/raycastNav.ts: register(mesh, route), pointermove=hover, click=go(route)
```

- 모든 scene 모듈은 `enter(ctx)` / `exit()` 반환. `exit` 에서 geometry/material/
  troika text/listener 해제 (메모리 누수 금지).

## 6. Theme

`src/lib/theme.ts` 유지. `data-theme` 토글 + `theme-changed` 이벤트 →
`renderer.setClearColor(--three-bg)`, troika 색 갱신. 토글 UI 는 캔버스 안 3D 버튼
(우상단), 숨김 DOM 에도 real `<button>` 미러(접근성).

## 7. 의존성

- 신규: **`troika-three-text`** — WebGL SDF 텍스트. TextGeometry 로 본문 렌더는
  불가/추함. 정당화된 추가.
- 유지: `three`. **제거 검토:** `three-bvh-csg`, `three-mesh-bvh`, `lil-gui` 는
  designer 전용 — designer 가 쓰면 유지, 아니면 제거.

## 8. 환경 매트릭스

| 환경 | 명령 | 비고 |
| --- | --- | --- |
| 개발 | `npm run dev` | Astro dev. 캔버스 HMR. |
| 정적 검증 | `npm run build && npm run preview` | 산출 HTML 확인 |
| 프로덕션 | main push → Pages | `base: '/portfolio/'` |

## 9. 검증 (acceptance)

`npm run build` 후:

```bash
test -f dist/index.html
test -f dist/works/index.html      # 셸 alias
test -f dist/about/index.html      # 셸 alias
test -f dist/designer/index.html
test -f dist/404.html
test -d dist/study                 # markdown 보존
```

런타임 (preview):

1. `/` 로드 → 평면 종이 → 접힘 애니메이션, idle 회전.
2. works 라벨 클릭 → works room 전이, URL `/works` 로 변경, **새로고침 없음**.
3. `/works` 직접 입력 + 새로고침 → 동일 works room 으로 부팅.
4. 뒤로가기 → home 으로 카메라/접힘 복귀.
5. study 라벨 클릭 → 실제 `/study/` HTML 로 hard nav.
6. JS 끄거나 크롤러 → 숨김 시맨틱 DOM 의 텍스트·링크 노출 (a11y/SEO).
7. 접기 엔진 자체 점검: `isFlatFoldable(homePattern) === true` (§4).

## 10. 알려진 제약

- 서버 런타임 없음 (정적). `/portfolio/` 서브패스 고정.
- 캔버스 콘텐츠는 숨김 DOM 이 SSOT — 신규 work/about 문구는 `index.astro` 에 작성.
- WebGL 미지원/JS off → 숨김 DOM 만 보임 (graceful degradation).
- rigid origami 보간(§4)은 단일 정점 패턴 위주. 복잡한 multi-vertex 동시 접힘은
  rigid 보간으로는 비범위 — compliant solver 로 해결 (§12 B4).

---

## 11. 작업 흐름

1. 이 SPEC 을 먼저 읽어 §3 라우트 / §4·§5 계약 / §9 검증 파악.
2. 변경 시 §9 로 위반 확인.
3. 구조 변경은 SPEC 부터 갱신 후 코드.

## 12. Backlog

### B1. Designer (crease-pattern lab) — 유지·정리
기존 `designer.astro` 는 이 컨셉의 "작업실" 로 유지. 빈 AdSense 박스 제거
(`designer-ad` div + `.designer-ad` 스타일 + BaseLayout AdSense `<script>`).

### B2. Glueless origami 패키지 (이론 학습 중, 코드 미구현)
Masu/Tray 등 풀 없이 닫히는 박스 — `src/lib/glueless/` (patterns/foldSimulator/
validator/cutGuide) + designer 연동. 접기 엔진(§4) 성숙 후 그 위에 구축.

### B3. OKF 지식 그래프 (format 채택 완료, 3D 뷰 미구현)
**상태**: OKF (Open Knowledge Format, GoogleCloudPlatform/knowledge-catalog) 채택됨.
`scripts/export-okf.mjs` 가 `src/content/study/**` 노트(en) → `public/okf/` 번들 생성:
- `index.md` (`okf_version: "0.1"`) + `concepts/` + `maps/` (frontmatter + bundle-relative
  링크 = 엣지). OKF 도구·visualizer 호환.
- `graph.json` (nodes + edges) — Three.js study room 소비용.
- `npm run build` 에 포함(`okf:export`). 결정적(timestamp 없음). `public/okf/` gitignore.
- **GCloud 비과금**: OKF의 reference agent(BigQuery+Gemini, 과금)는 미사용 — 노트가 이미
  수작업 distill 됨. format + visualizer 만 채택.

**미구현**: study room 을 단일 캔버스(§3) 안 **3D force-directed 지식 그래프**로.
`graph.json` fetch → 노드=concept, 엣지=prereq/related, 클릭 → 실제 `/study/<id>/` HTML.

### B4. Origami Simulator 급 접기 엔진 (북극성 2축, §0)
[origamisimulator.org](https://origamisimulator.org) (Ghassaei·Demaine·Gershenfeld,
7OSME) 아키텍처를 참조 모델로. rigid 보간(§4) 위에 단계적으로:

1. **FOLD 내부 포맷** — `CreasePattern` 을 [FOLD spec](https://github.com/edemaine/fold)
   과 상호 변환. SVG crease pattern import (M/V 를 색/스타일로), 다각형 face 는
   earcut 류로 삼각화.
2. **Compliant solver** — 모든 crease 를 동시에 접음. 초기 평면 시트에 crease 가
   가하는 힘으로 미소 변위를 반복 해석 (Schenk & Guest 구조공학 모델 +
   Tachi freeform variations). CPU 구현 먼저, GPU(fragment shader) 는 성능 필요 시.
3. **재질/강성** — axial(면내) · crease(접힘) · face(굽힘) 강성 파라미터 노출.
   fold percent 슬라이더 (−100%…100%, 음수 = MV 반전). strain 시각화는 후순위.
4. **Export** — 접힌 상태를 FOLD/STL/OBJ 로 (3D 모델링 툴 입력), 평면 crease
   pattern 을 SVG 도면으로 (손 접기용). designer(B1) 가 이 파이프라인의 UI.

곡선 crease (ruling-aware triangulation) 는 명시적 비범위 — 필요해지면 추가.

### B5. Façade rationalization 데모 work
사용자의 façade consultant 이력 반영. 인터랙티브 패널화: freeform 곡면 →
평면 삼각/실린더 기반 패널 fit, 원면과의 편차 히트맵, 패널 수/코스트
지표. 랜딩 fold journey 의 "Rationalize" 비트(스토리)와 짝을 이루는
본격 쇼케이스. 상세 설계는 착수 시.
