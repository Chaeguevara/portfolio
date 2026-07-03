---
type: concept
title: 크리스 패턴 임포트 파이프라인 (Crease Pattern Import Pipeline)
lang: ko
pair: "[[crease-pattern-import-pipeline]]"
summary: 느슨한 드로잉 지오메트리에서 접기 그래프를 복원 — 끝점 병합, 교차·T-junction 분할, 정리, 평면 face 추적, 삼각화.
tags: [origami, implementation, computational-geometry]
prereqs: [[[svg-crease-pattern-format.ko]]]
related: [[[compliant-fold-simulation.ko]], [[crease-pattern.ko]]]
source: []
status: draft
---
# 크리스 패턴 임포트 파이프라인 (Crease Pattern Import Pipeline)

*(English: [Crease Pattern Import Pipeline](/portfolio/study/crease-pattern-import-pipeline/))*

> 느슨한 드로잉 지오메트리에서 접기 그래프를 복원 — 끝점 병합, 교차·T-junction
> 분할, 정리, 평면 face 추적, 삼각화.

## 개념
그려진 크리스 패턴은 선분 무더기이지 그래프가 아니다. 임포터
(`src/app/fold/svgImport.ts` 로 포트)는 정해진 순서로 위상을 재구축한다:
1. 허용 오차 내 끝점 병합 (spatial hash),
2. 루프/중복 제거,
3. 진짜 교차 *및* T-junction (끝점이 다른 변의 내부에 놓임 — 크리스가
   테두리에 닿는 흔한 경우) 에서 변 분할,
4. 공선 차수-2 정점 병합, 고립 정점 제거,
5. 각 정점의 이웃을 각도로 정렬해 평면 face 추적,
6. 삼각화 (사각형은 짧은 대각선, n각형은 earcut) — 새 대각선은 모두 목표각
   0 의 facet("F") 변이 된다.

## 왜 중요한가
이후의 모든 보장 — 닫히는 face, 인접 삼각형이 정확히 둘인 힌지, 풀 수 있는
스프링 네트워크 — 이 이 정리 단계에 달려 있다. 임포트 실패 대부분은 나중의
물리 실패가 아니라 여기서의 위상 실패다.

## 세부
- Face 추적은 각 방향 변을 한 번씩 걸으며 매 스텝 다음-시계방향 이웃을
  취한다; 내부 face 는 전부 한 방향, 무한 외부 face 는 반대 방향으로 나와
  그걸로 버려진다.
- 허용 오차는 두 번 작용한다: 끝점 병합, 그리고 교차점이 끝점"에" 있는지
  (T-junction) 내부인지 (진짜 교차) 판정.
- 테두리 변으로만 둘러싸인 face 는 종이가 아니라 구멍이다.

## 관련
[SVG 크리스 패턴 포맷](/portfolio/study/svg-crease-pattern-format.ko/) · [순응형 접기 시뮬레이션](/portfolio/study/compliant-fold-simulation.ko/)
