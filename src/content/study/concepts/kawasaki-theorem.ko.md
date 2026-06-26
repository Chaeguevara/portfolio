---
type: concept
title: 가와사키 정리 (Kawasaki's Theorem)
lang: ko
pair: "[[kawasaki-theorem]]"
course: "6.849"
lectures: [3]
summary: 차수 2n인 한 꼭짓점이 평평하게 접힐 필요충분조건은 교대 각 합이 0°, 즉 홀수 번째 각들의 합이 180°인 것.
tags: [origami, flat-folding, theorem]
prereqs: [[[crease-pattern.ko]]]
related: [[[maekawa-theorem.ko]], [[single-vertex-flat-foldability.ko]]]
source: [[[L03-single-vertex-crease-patterns]]]
status: draft
---
# 가와사키 정리 (Kawasaki's Theorem)

*(English: [Kawasaki's Theorem](/portfolio/study/kawasaki-theorem/))*

> 차수 2n인 한 꼭짓점이 평평하게 접힐 필요충분조건은 교대 각 합이 0°, 즉 홀수 번째 각들의 합이 180°인 것.

## 정리
내부 꼭짓점 둘레의 연속된 각을 `α₁, α₂, …, α₂ₙ` 이라 하자. 이 꼭짓점이 (기하적으로)
평평하게 접힐 필요충분조건은

```
α₁ − α₂ + α₃ − α₄ + … + α₂ₙ₋₁ − α₂ₙ = 0
```

즉 `α₁ + α₃ + … = α₂ + α₄ + … = 180°`. 이것이 단일 꼭짓점 평평 접힘의 **기하적**
절반이고, [마에카와 정리](/portfolio/study/maekawa-theorem.ko/)가 조합적 절반이다.

## 왜 중요한가
산/골을 배정하기 *전에* 각도 **만으로** 그 꼭짓점이 애초에 평평하게 접힐 *수 있는지*를
알려준다. 필요조건: 차수가 짝수여야 한다(아니면 교대 합이 0이 될 수 없음).

## 직관
평평하게 접힌다는 건 꼭짓점 둘레를 돌 때 종이가 처음 방향으로 돌아와야 한다는 뜻이다.
각 각도가 방향을 전진시키고, 연속된 영역이 반대쪽으로 접히므로 부호가 교대로 ±가
된다. 두 교대 그룹이 각각 평각(180°)이 될 때 정확히 상쇄된다.

## 특수 경우 — 차수 4
각이 `α, β, α, β` 이고 `α + β = 180°` 이면 가와사키는 자동으로 만족된다. 흥미로운
제약은 그때 MV([마에카와 정리 (Maekawa's Theorem)](/portfolio/study/maekawa-theorem.ko/), [큰-작은-큰 보조정리 (Big–Little–Big Lemma)](/portfolio/study/big-little-big-lemma.ko/))와
[강체 종이접기](/portfolio/study/rigid-origami.ko/)에서 나온다.

## 관련
[마에카와 정리 (Maekawa's Theorem)](/portfolio/study/maekawa-theorem.ko/) · [단일 꼭짓점 평평 접힘 (Single-Vertex Flat-Foldability)](/portfolio/study/single-vertex-flat-foldability.ko/) · [큰-작은-큰 보조정리 (Big–Little–Big Lemma)](/portfolio/study/big-little-big-lemma.ko/)
