---
type: concept
title: 순응형 접기 시뮬레이션 (Compliant Fold Simulation)
lang: ko
pair: "[[compliant-fold-simulation]]"
summary: 스프링-질량 시트를 크리스 목표각으로 이완시켜 접기를 시뮬레이션 — 모든 크리스가 동시에 접히고 접기 순서가 필요 없다.
tags: [origami, simulation, implementation]
prereqs: [[[crease-pattern.ko]]]
related: [[[rigid-origami.ko]], [[crease-torsional-spring.ko]], [[axial-spring-and-timestep.ko]], [[crease-pattern-import-pipeline.ko]]]
source: []
status: draft
---
# 순응형 접기 시뮬레이션 (Compliant Fold Simulation)

*(English: [Compliant Fold Simulation](/portfolio/study/compliant-fold-simulation/))*

> 스프링-질량 시트를 크리스 목표각으로 이완시켜 접기를 시뮬레이션 — 모든
> 크리스가 동시에 접히고 접기 순서가 필요 없다.

## 개념
[강체 종이접기](/portfolio/study/rigid-origami.ko/)의 정확한 기구학을 푸는 대신,
**순응형(compliant)** 시뮬레이터는 삼각화된 시트를 스프링 네트워크로 다룬다:
모든 변은 축 방향 스프링, 모든 크리스는 두 면을 `foldPercent × 목표각`으로
당기는 비틀림 스프링이다. 평평한 상태에서 작은 동역학 스텝을 반복하면 *모든*
크리스가 한꺼번에 접힌다 — Ghassaei·Demaine·Gershenfeld 의 Origami Simulator
(7OSME) 방식이며, Schenk & Guest 의 구조공학 모델과 Tachi 의 freeform
origami 를 잇는다.

## 왜 중요한가
강체 기구학은 엄밀히 rigid-foldable 하지 않은 패턴(흥미로운 패턴 대부분)에서
실패하지만, 순응형 모델은 항상 *어떤* 접힘 상태를 내놓고 재질 강성이 조절
가능한 파라미터로 자연스럽게 드러난다. `/portfolio/simulator` 의 엔진이다
(`src/app/fold/solver.ts` — 원본 GPU 셰이더의 CPU 포트).

## 세부
- 제약: 축 방향 ([축 스프링과 시간 간격](/portfolio/study/axial-spring-and-timestep.ko/)),
  크리스 비틀림 ([크리스 비틀림 스프링](/portfolio/study/crease-torsional-spring.ko/)),
  그리고 선택적 face anti-shear 항 (미이식 — 삼각형은 세 축 스프링만으로
  거의 강체).
- 적분: symplectic Euler — 현재 위치의 힘으로 속도를 먼저 갱신하고, *새*
  속도로 위치를 갱신. 노드 질량은 균일하게 1.
- `foldPercent ∈ [−1, 1]` 이 모든 크리스 목표각을 스케일; 음수면 산·골이
  전역으로 뒤바뀐다.
- 충돌 처리 없음: 자기 교차 패턴("needsCollisions" 예제들)은 자신을
  뚫고 접힌다.

## 관련
[강체 종이접기](/portfolio/study/rigid-origami.ko/) · [크리스 비틀림 스프링](/portfolio/study/crease-torsional-spring.ko/) · [축 스프링과 시간 간격](/portfolio/study/axial-spring-and-timestep.ko/)
