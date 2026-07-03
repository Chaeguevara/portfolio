---
type: concept
title: 크리스 비틀림 스프링 (Crease Torsional Spring)
lang: ko
pair: "[[crease-torsional-spring]]"
summary: 접는 선을 힌지 힘으로 — 토크 K·(목표각 − θ) 를 두 꼭짓점(apex)에 면 법선 방향으로 가하고, 반작용을 크리스 양 끝점에 분배한다.
tags: [origami, simulation, implementation]
prereqs: [[[compliant-fold-simulation.ko]]]
related: [[[mountain-valley-assignment.ko]], [[axial-spring-and-timestep.ko]]]
source: []
status: draft
---
# 크리스 비틀림 스프링 (Crease Torsional Spring)

*(English: [Crease Torsional Spring](/portfolio/study/crease-torsional-spring/))*

> 접는 선을 힌지 힘으로 — 토크 K·(목표각 − θ) 를 두 꼭짓점(apex)에 면 법선
> 방향으로 가하고, 반작용을 크리스 양 끝점에 분배한다.

## 개념
인접 삼각형 두 개를 가진 내부 크리스는 **4-노드 스텐실**을 이룬다: 크리스
양 끝점 둘과 삼각형마다 하나씩의 apex 꼭짓점 둘. 이면각은
`θ = atan2(dot(cross(n₁, ê), n₂), dot(n₁, n₂))` (`ê` 는 크리스 단위 벡터)로
구하고, ±π 를 넘어갈 때를 위해 직전 스텝 값 기준으로 unwrap 한다. 강성
`K = k·L₀` (접기 크리스와 facet 대각선은 별도 `k`)의 스프링이
`F = K·(percent·목표각 − θ)` 를 만든다.

## 왜 중요한가
1 자유도 각도 제약이 꼭짓점에 걸리는 평범한 힘으로 환원되는 지점이다 —
시트의 접힘 거동 전체가 여기로 귀결된다.
[산-골 배정](/portfolio/study/mountain-valley-assignment.ko/)은 오직 목표각의
*부호*로만 들어온다.

## 세부
- Apex 힘: 해당 삼각형 법선 방향으로 `(F/h)·n`. `h` 는 apex 에서 크리스
  직선까지의 수직 거리 (모멘트 팔).
- 크리스 끝점 반작용: apex 의 크리스 위 정규화 투영 `c` 로 가중한
  `−F·((1−c)/h₁·n₁ + …)` — 합력과 합토크가 구조적으로 상쇄된다.
- 퇴화 가드: 크리스 길이나 높이가 ~0 이면 그 스텝은 힌지를 건너뛴다
  (완전히 접힌 접선은 법선 방향이 정의되지 않는다).
- 삼각화가 만든 facet("F") 대각선은 목표각 0 의 같은 스프링 — 다각형 면을
  평면으로 유지한다.

## 관련
[순응형 접기 시뮬레이션](/portfolio/study/compliant-fold-simulation.ko/) · [산-골 배정](/portfolio/study/mountain-valley-assignment.ko/)
