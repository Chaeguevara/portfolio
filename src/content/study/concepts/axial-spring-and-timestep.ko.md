---
type: concept
title: 축 스프링과 시간 간격 (Axial Springs & Time Step)
lang: ko
pair: "[[axial-spring-and-timestep]]"
summary: 모든 변은 K = EA/L₀ 의 Kelvin–Voigt 스프링 + 임계 감쇠; 안정 스텝은 dt = 0.9 / (2π·√(K_max/m)).
tags: [origami, simulation, implementation]
prereqs: [[[compliant-fold-simulation.ko]]]
related: [[[crease-torsional-spring.ko]]]
source: []
status: draft
---
# 축 스프링과 시간 간격 (Axial Springs & Time Step)

*(English: [Axial Springs & Time Step](/portfolio/study/axial-spring-and-timestep/))*

> 모든 변은 K = EA/L₀ 의 Kelvin–Voigt 스프링 + 임계 감쇠; 안정 스텝은
> dt = 0.9 / (2π·√(K_max/m)).

## 개념
시트의 면내 거동은 삼각화된 패턴의 **모든** 변에 스프링을 놓는 데서 온다:
`K = EA/L₀` (짧은 변일수록 뻣뻣 — 균일 재질의 근사) 에 감쇠
`D = ζ·2·√(K·m)` (감쇠비 ζ 의 임계 감쇠 꼴). 힘은 변 방향으로
`K·Δ신장 + D·Δv`.

## 왜 중요한가
뻣뻣한 스프링의 explicit 적분은 dt 가 가장 빠른 진동자를 존중하지 않으면
발산한다. 가장 뻣뻣한 변의 고유 진동수 `f = √(K_max/m)` 를 잡아 `1/(2πf)` 의
90% 로 스텝을 두면 패턴별 튜닝 없이 전체 메시가 안정 — 임의의 임포트 패턴이
"그냥 되는" 이유가 이 규칙 하나다.

## 세부
- Origami Simulator 기본값: `EA = 20`, `ζ = 0.45`, 노드 질량 `m = 1`.
- 강성이나 기하가 바뀌면 dt 를 재계산해야 한다 (UI 강성 슬라이더가
  `K_max` 를 바꾼다).
- 전 변의 `|len/L₀ − 1|` 평균은 값싼 전역 strain 지표 — 접힘 상태가 정합이면
  0 근처, 패턴이 자기 자신과 싸우면 수 %.
- 축 스프링 셋이 각 삼각형을 면내에서 거의 강체로 만들므로 별도의 face
  anti-shear 항은 선택 사항이다.

## 관련
[순응형 접기 시뮬레이션](/portfolio/study/compliant-fold-simulation.ko/) · [크리스 비틀림 스프링](/portfolio/study/crease-torsional-spring.ko/)
