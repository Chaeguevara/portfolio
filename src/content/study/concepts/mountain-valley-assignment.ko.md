---
type: concept
title: 산-골 배정 (Mountain–Valley Assignment)
lang: ko
pair: "[[mountain-valley-assignment]]"
course: "6.849"
lectures: [2, 3]
summary: 모든 크리스를 산(mountain, 바깥으로 접힘) 또는 골(valley, 안으로 접힘)으로 라벨링한 것.
tags: [origami, flat-folding]
prereqs: [[[crease-pattern.ko]]]
related: [[[maekawa-theorem.ko]], [[flat-foldability.ko]]]
source: [[[L02-simple-folds]], [[L03-single-vertex-crease-patterns]]]
status: draft
---
# 산-골 배정 (Mountain–Valley Assignment)

*(English: [Mountain–Valley Assignment](/portfolio/study/mountain-valley-assignment/))*

> 모든 크리스를 산(mountain, 바깥으로 접힘) 또는 골(valley, 안으로 접힘)으로 라벨링한 것.

## 개념
[크리스 패턴](/portfolio/study/crease-pattern.ko/)이 주어졌을 때, **산-골 배정(MV assignment)** 은 각
크리스를 **산(mountain, M)** — 능선이 위로, 종이가 바깥으로 접힘 — 또는
**골(valley, V)** — 골이 위로, 종이가 안으로 접힘 — 으로 칠한다. M과 V는 거울상이라
종이를 뒤집으면 서로 바뀐다.

## 왜 중요한가
같은 크리스 패턴이라도 어떤 MV 배정에서는 접히고 다른 배정에서는 불가능할 수 있다.
이 과목의 두 핵심 정리가 꼭짓점에서 유효한 배정을 제약한다:
[마에카와 정리](/portfolio/study/maekawa-theorem.ko/)(M과 V 개수의 *조합적* 조건)와
[큰-작은-큰 보조정리](/portfolio/study/big-little-big-lemma.ko/)(국소 강제 규칙).

## 세부
- 평평하게 접히는 내부 꼭짓점에서 [마에카와 정리](/portfolio/study/maekawa-theorem.ko/)는
  |M수 − V수| = 2 를 강제한다.
- MV 개수가 합법이어도 *전역* 층 순서(layer ordering)가 종이를 종이 사이로 통과시킬
  수 있다 — 그래서 전역 평평 접힘이 어렵다([평평 접힘의 NP-난해성 (NP-Hardness of Flat Foldability)](/portfolio/study/flat-foldability-np-hardness.ko/)).
- 주어진 CP를 평평하게 접게 하는 MV 배정이 몇 개인지 세는 것 자체가 풍부한 조합 문제다.

## 관련
[크리스 패턴 (Crease Pattern)](/portfolio/study/crease-pattern.ko/) · [마에카와 정리 (Maekawa's Theorem)](/portfolio/study/maekawa-theorem.ko/) · [큰-작은-큰 보조정리 (Big–Little–Big Lemma)](/portfolio/study/big-little-big-lemma.ko/)
