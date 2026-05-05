# Portfolio Spec

이 문서가 단일 진실 원본 (Single Source of Truth) 이다. 작업·검증 모두 spec 기준.
구조 변경 시 spec.md 부터 갱신 후 코드.

## 1. 목적

정적 Three.js 포트폴리오. **Astro 5 + GitHub Pages**, `/portfolio/` 서브패스에서 호스팅.
각 라우트는 진짜 정적 HTML 파일이라 새로고침·뒤로가기는 GitHub Pages 가 native 처리 —
SPA 폴백 트릭 없음.

## 2. 디렉터리 구조

```
portfolio/
├── src/
│   ├── pages/                     # Astro 라우트 (파일 = URL)
│   │   ├── index.astro            # /
│   │   ├── about.astro            # /about/
│   │   ├── designer.astro         # /designer/
│   │   ├── 404.astro              # 404 페이지
│   │   └── works/
│   │       ├── index.astro        # /works/
│   │       └── [id].astro         # /works/<id>/  (getStaticPaths)
│   ├── layouts/BaseLayout.astro   # html/head/body, theme/dropdown 초기화
│   ├── components/
│   │   ├── Nav.astro              # 공통 네비게이션
│   │   └── ProgressTracker.ts     # In Progress 모달 컴포넌트
│   ├── data/
│   │   ├── works.ts               # Works registry (§3)
│   │   └── inProgress.ts          # 진행중 항목 데이터
│   ├── lib/                       # 유틸 모듈
│   │   ├── theme.ts               # light/dark 토글, theme-changed 이벤트
│   │   ├── inProgress.ts          # In Progress 드롭다운 init
│   │   ├── overlayToggle.ts       # work 상세 오버레이
│   │   ├── designerEngine.ts      # designer 페이지 코어
│   │   ├── designer3DPreview.ts   # designer 3D 미리보기
│   │   ├── planarGraph.ts         # 평면 그래프 자료구조
│   │   ├── osmClient.ts           # OSM 데이터 fetch
│   │   ├── elevationClient.ts     # 고도 API
│   │   ├── gpuPickHelper.ts       # GPU picking
│   │   ├── progressStore.ts
│   │   └── game.ts
│   ├── models/                    # Three.js 씬 모듈 (§4)
│   ├── styles/                    # SCSS 모듈
│   └── config.ts                  # 전역 설정 (three 배경 등)
├── astro.config.mjs               # base: '/portfolio/', static, three chunk
├── spec.md                        # ← 이 문서
├── public/                        # 정적 자산 (vite.svg 등)
├── dist/                          # 빌드 산출물 (gitignored)
└── .github/workflows/deploy.yml   # main 푸시 → Pages 배포
```

## 3. 라우트 계약

| URL                            | 산출물 (`dist/...`)             | 페이지 종류                 |
| ------------------------------ | ------------------------------ | --------------------------- |
| `/portfolio/`                  | `index.html`                   | Home (정적)                 |
| `/portfolio/works/`            | `works/index.html`             | Work grid + 미니 프리뷰     |
| `/portfolio/works/<id>/`       | `works/<id>/index.html`        | 단일 work + Three.js 씬     |
| `/portfolio/about/`            | `about/index.html`             | About + about 씬            |
| `/portfolio/designer/`         | `designer/index.html`          | Crease pattern designer     |
| (그 외)                        | `404.html`                     | 404 페이지                  |

`<id>` 는 §4 Work Registry 키 (현재 1–16). 빌드 시 `getStaticPaths()` 가 모든 id 정적 prerender.

## 4. Work Registry

`src/data/works.ts` 의 `Works: Record<number, ...>`.

```ts
{
  title: string;
  body: string;            // 카드용 짧은 설명
  category: 'featured' | 'fundamentals';
  details?: string;        // 오버레이 + 설명 섹션 HTML
  animation: (scene, opts?) => cleanup | Promise<cleanup>;
}
```

- **id**: 객체 키 (숫자). featured = 10–16, fundamentals = 1–9.
- **animation**: 모두 dynamic import → 각 work 모듈 자체 chunk. 신규 work도 같은 패턴.

## 5. Three.js Scene Module 시그니처

`src/models/<sceneName>.ts`:

```ts
export function sceneName(
  scene: THREE.Scene,
  opts?: { mount?: HTMLElement; preview?: boolean }
): (() => void) | Promise<() => void>
```

- `opts.mount` 미지정 시 `document.getElementById('work')` 사용.
- `opts.preview === true` → 컨트롤 없이 카드용 축소 렌더.
- 반환값 = cleanup. WebGL renderer / geometry / material / 이벤트 리스너 모두 해제.

## 6. Theme System

CSS 변수 (`src/styles/_variables.scss`): `--bg`, `--text`, `--accent`, `--three-bg`.

- `src/lib/theme.ts` 가 `data-theme="light|dark"` 토글 + `theme-changed` CustomEvent dispatch.
- 활성 씬은 `theme-changed` 리스너로 `scene.background` 갱신 (각 페이지 `<script>` 안).
- Astro 페이지 네비게이션 = full reload → 페이지 간 cleanup 은 unload 시점에 자동.

## 7. 환경 매트릭스

| 환경                  | 명령              | 새로고침/뒤로가기 |
| --------------------- | ----------------- | ----------------- |
| 개발                  | `npm run dev`     | ✓ Astro dev 서버  |
| 로컬 정적 검증        | `npm run preview` | ✓ 정적 파일 서빙  |
| 프로덕션 GitHub Pages | (자동 배포)       | ✓ 각 라우트 = 실제 HTML |

## 8. 신규 work 추가

1. `src/models/<name>.ts` 작성 (§5 시그니처).
2. `src/data/works.ts` 의 `Works` 에 새 id entry:
   ```ts
   17: {
     title: "...", body: "...", category: 'featured', details: `...`,
     animation: (scene, opts) =>
       import('../models/<name>').then(m => m.<name>(scene, opts)),
   }
   ```
3. `npm run build` → `dist/works/17/index.html` 자동 생성 확인.

## 9. 빌드·배포

- 로컬: `npm run build` = `astro check && astro build` → `dist/`
- 배포: `main` 푸시 → `.github/workflows/deploy.yml` → Pages
- `astro.config.mjs` 의 `base: '/portfolio/'` 가 모든 자산·링크에 prefix 부여

## 10. 검증

`npm run build` 후 다음 산출물 존재 = spec 충족:

```bash
test -f dist/index.html
test -f dist/about/index.html
test -f dist/works/index.html
test -f dist/designer/index.html
test -f dist/404.html
for id in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16; do
  test -f "dist/works/$id/index.html" || echo "MISSING: works/$id"
done
```

prod 수동 검증:

1. `https://chaeguevara.github.io/portfolio/works/3` 직접 입력 → 200, 씬 렌더
2. 새로고침 → 동일 페이지 재로드
3. 뒤로가기 → 이전 라우트 이동
4. Designer 에서 Miura 패턴 → STL export 동작

## 11. 알려진 제약

- 서버 런타임 없음 (정적 전용)
- `/portfolio/` 서브패스 고정. 커스텀 도메인 시 `astro.config.mjs` 의 `base` 변경 필요.
- Three.js 씬은 client-only (`<script>` 안). SSG 시 실행 X.
- `getStaticPaths()` 는 `Works` 메타데이터만 사용 — animation 함수는 빌드 시 호출 X.

---

## 12. 작업 흐름

향후 Claude 세션:

1. **이 spec.md 를 먼저 읽어** 라우트 / 시그니처 / 검증 규칙 파악.
2. 변경 시 §10 검증 명령으로 spec 위반 여부 확인.
3. spec 자체를 변경해야 하는 작업(구조 변경, 신규 라우트) 은 spec.md 부터 갱신 후 코드.

---

# 진행 작업 (Backlog)

spec.md 는 "현재 상태 + 다음 할 일" 을 함께 담는다. 아래는 합의된 작업 목록 — 각 항목은
구현 시 별도 섹션(§N)으로 정식 spec 에 흡수.

## B1. Glueless Origami Package (최우선)

**상태**: 이론 학습 중. 코드 미구현. spec 만 선반영.

### B1.1 배경
사용자는 MIT 6.849 Geometric Folding Algorithms 학습 흐름에서, 풀·테이프 없이
종이 한 장의 folding 만으로 닫히는 박스류 (glueless origami) 를 다루는
**전용 패키지 / 도구** 가 필요. 현재 `designer.astro` 의 pattern select 는
`masu-box`, `tray-box` 옵션만 placeholder 로 가지고 있고, validation·STL export
모두 tessellation 전용 — glueless box 는 실제로는 동작하지 않음.

### B1.2 목적
- Glueless 박스 패밀리(Masu, Tray, 그 외 origami box)를 1급 시민으로 다루기.
- Crease pattern → 3D 폴딩 시뮬레이션 → 종이 컷팅 가이드 (PDF/SVG) 까지 일관된 파이프라인.
- 검증: 입력 패턴이 실제로 닫힌 박스로 접히는지 (rigid foldability + non-self-intersection)
  알고리즘적으로 보장.

### B1.3 범위 (초안 — 구현 시점에 §13 으로 격상)
- **`src/lib/glueless/`** (신규 디렉터리)
  - `patterns.ts` — Masu / Tray / 외 박스의 parametric crease pattern 생성 (cols/rows 대신
    box 차원: width / depth / height).
  - `foldSimulator.ts` — 평면 패턴 → 3D 폴딩 상태 보간. dihedral angle 시간축 애니메이션.
  - `validator.ts` — rigid foldability 체크. tessellation 의 Kawasaki/Maekawa 와 다른
    rule (closure + non-overlap) 검사.
  - `cutGuide.ts` — 종이 컷팅 PDF/SVG. tab/slit 위치 명시.
- **`src/pages/designer.astro`** 갱신
  - "Pattern" select 에 glueless 그룹 (이미 placeholder 존재) 가 실제로 작동.
  - Tessellation / glueless 모드별로 **검증 패널·export 버튼 세트** 가 분기.
  - STL export: glueless 박스도 panel + hinge 분리 export (현재 tessellation 만 지원).
- **`src/pages/works/`** 에 1개 work entry (e.g. id `17`) 로 학습 시각화 추가
  — Masu box 의 폴딩 단계별 애니메이션을 카드 프리뷰까지 포함.

### B1.4 학습 트랙 (사용자가 따라가는 이론)
사용자가 공부 중인 토픽 — 구현 우선순위 결정에 사용:

1. **Rigid Origami** — panel 이 변형 없이 hinge 만 회전. Masu / Tray 의 기본 모델.
2. **Closure conditions** — 박스가 닫히려면 dihedral angle 들이 만족해야 하는 대수 관계.
3. **Tab / lock geometry** — 풀 없이 잠기게 하는 종이 끝 형태(예: Masu 의 corner tuck).
4. **Cut vs. fold trade-off** — glueless 라도 종이를 자를지(=tray 류) vs. 한 장 통째로
   접을지 (=masu 류) 의 분류.

학습 노트 / 참고 문헌은 사용자가 수기로 보충. Claude 는 spec 의 §B1.3 범위만 구현 대상.

### B1.5 비범위 (이번 라운드에서 다루지 않음)
- 자유 형태 박스 (임의 다각형 단면) — 직사각형 단면만.
- 컬러·텍스처드 종이 시뮬레이션.
- 인터랙티브 polyhedra 펼침 (다른 학습 단원).

### B1.6 인수 조건 (구현 시 검증)
- `/portfolio/designer/` 에서 Masu 선택 → 3D 미리보기에 닫힌 박스 형성 (단계별 animation).
- "Download cut guide PDF" 버튼이 1장 짜리 cutting layout 출력.
- `validator.ts` 단위 테스트: 의도적으로 잘못된 dimension 입력 시 "박스 닫히지 않음" 에러.
- 새 work entry id `17` 가 `dist/works/17/index.html` 로 prerender.

---

## B2. Designer 우측 하단 빈 박스 제거

**상태**: 즉시 처리 가능. spec 에만 명시.

### B2.1 현상
`/portfolio/designer/` 우측 하단에 내용 없는 흰 박스가 보임.

### B2.2 원인
- `src/pages/designer.astro:98` 의 `<div class="designer-ad" id="designer-ad-slot"></div>`
  + `src/styles/_designer.scss:245` 의 `.designer-ad` 스타일이 300×250 박스를 absolute 로
  우측 하단에 배치. AdSense 가 placeholder publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`) 라
  실제 광고가 채워지지 않아 빈 카드만 남음.
- `src/layouts/BaseLayout.astro:18-23` 의 AdSense 스크립트가 모든 페이지에 로드되어
  공용 부수 효과 발생.

### B2.3 조치
1. `src/pages/designer.astro` 에서 `<div class="designer-ad">` 삭제.
2. `src/styles/_designer.scss` 의 `.designer-ad` 블록 삭제.
3. (옵션) 실제 publisher ID 가 들어오기 전까지 `BaseLayout.astro` 의 AdSense `<script>`
   태그를 제거 — 모든 페이지에서 깔끔.

### B2.4 인수 조건
- Designer 페이지 우측 하단 빈 박스 사라짐.
- `npm run build` 통과, 다른 페이지 영향 없음.
