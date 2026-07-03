---
type: concept
title: 큰-작은-큰 보조정리 (Big–Little–Big Lemma)
lang: ko
pair: "[[big-little-big-lemma]]"
course: "6.849"
lectures: [3]
summary: 평평하게 접히는 꼭짓점에서, 국소적으로 가장 작은 각 안의 크리스는 양옆 두 크리스와 산/골이 반드시 달라야 한다.
tags: [origami, flat-folding, theorem]
prereqs: [[[mountain-valley-assignment.ko]], [[kawasaki-theorem.ko]]]
related: [[[single-vertex-flat-foldability.ko]], [[maekawa-theorem.ko]]]
source: [[[L03-single-vertex-crease-patterns]]]
status: draft
---
# 큰-작은-큰 보조정리 (Big–Little–Big Lemma)

*(English: [Big–Little–Big Lemma](/portfolio/study/big-little-big-lemma/))*

> 평평하게 접히는 꼭짓점에서, 국소적으로 가장 작은 각 안의 크리스는 양옆 두 크리스와 산/골이 반드시 달라야 한다.

## 정리
내부 꼭짓점 둘레의 각들을 보자. 어떤 각 `αᵢ`가 **엄격한 국소 최소** — 양 이웃보다
작은 경우(두 "큰" 각 사이의 "작은" 각) — 라면, 어떤 평평 접힘에서도 `αᵢ`를 경계 짓는
두 크리스는 산/골 라벨이 **반대**여야 한다. 작은 영역이 접혀서 이웃 사이로 끼어든다.

## 왜 중요한가
이 규칙은 꼭짓점의 평평 접힘을 **탐욕적 소거 알고리즘**으로 바꾼다: 국소 최소 각을
반복해서 찾아, 그 경계 크리스를 반대 MV로 강제하고, "크림프(crimp)"해서 그 각을 양
이웃과 합쳐 재귀한다. 효율적인 [단일 꼭짓점 평평 접힘](/portfolio/study/single-vertex-flat-foldability.ko/)
판정과 유효 [MV 배정](/portfolio/study/mountain-valley-assignment.ko/) 세기의 엔진이다.

## 세부
- 가장 작은 각이 동률이면 별도 처리한다. 기본 규칙은 *엄격한* 최소가 필요하다.
- [마에카와](/portfolio/study/maekawa-theorem.ko/)(전역 ±2 개수)와 [가와사키](/portfolio/study/kawasaki-theorem.ko/)(각 조건)와
  결합하면, 한 꼭짓점에서 어떤 MV 배정이 평평하게 접히는지를 완전히 특징짓는다.

## 관련
[단일 꼭짓점 평평 접힘 (Single-Vertex Flat-Foldability)](/portfolio/study/single-vertex-flat-foldability.ko/) · [마에카와 정리 (Maekawa's Theorem)](/portfolio/study/maekawa-theorem.ko/) · [가와사키 정리 (Kawasaki's Theorem)](/portfolio/study/kawasaki-theorem.ko/)
