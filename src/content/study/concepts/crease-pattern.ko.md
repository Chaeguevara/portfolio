---
type: concept
title: 크리스 패턴 (Crease Pattern)
lang: ko
pair: "[[crease-pattern]]"
course: "6.849"
lectures: [2, 3]
summary: 펼친 종이 위에 그려진 모든 접는 선(fold line)의 평면 도면.
tags: [origami, flat-folding]
prereqs: []
related: [[[mountain-valley-assignment.ko]], [[flat-foldability.ko]], [[simple-fold.ko]]]
source: [[[L02-simple-folds]], [[L03-single-vertex-crease-patterns]]]
status: draft
---
# 크리스 패턴 (Crease Pattern)

*(English: [Crease Pattern](/portfolio/study/crease-pattern/))*

> 펼친 종이 위에 그려진 모든 접는 선(fold line)의 평면 도면.

## 개념
**크리스 패턴(crease pattern, CP)** 은 펼쳐진 종이와, 그 종이를 접게 될 선분
(크리스, crease)들의 집합을 함께 가리킨다. 종이가 *어디서* 접히는지는 기록하지만
각 크리스가 *어느 방향으로* 접히는지는 아직 담지 않는다 — 그 추가 정보가
[산-골 배정](/portfolio/study/mountain-valley-assignment.ko/)이다.

## 왜 중요한가
크리스 패턴은 이 과목의 거의 모든 종이접기 질문의 기본 입력이다: *이 CP는 평평하게
접을 수 있나? 어떤 모양으로? 어떤 접기 순서로?* 종이접기 **설계(design)** 알고리즘은
크리스 패턴을 출력하고, **접힘 가능성(foldability)** 알고리즘은 그것을 입력으로 받는다.

## 세부
- 종이 내부의 한 점에서 만나는 크리스들은 **내부 꼭짓점(interior vertex)** 을
  이룬다. 접었을 때 그 주변 종이가 모순 없이 닫혀야 한다.
- 크리스 패턴 자체는 층 순서(layer order)를 말해주지 않는다. CP로부터 올바른 접힌
  상태를 정하는 것이 어려운 부분이다([평평 접힘의 NP-난해성](/portfolio/study/flat-foldability-np-hardness.ko/)).
- 꼭짓점의 차수(degree) = 그곳에서 만나는 크리스 수. 평평하게 접히는 내부 꼭짓점은
  항상 *짝수* 차수다([마에카와 정리](/portfolio/study/maekawa-theorem.ko/)의 따름).

## 관련
[산-골 배정 (Mountain–Valley Assignment)](/portfolio/study/mountain-valley-assignment.ko/) · [평평 접힘 (Flat-Foldability)](/portfolio/study/flat-foldability.ko/) · [단일 꼭짓점 평평 접힘 (Single-Vertex Flat-Foldability)](/portfolio/study/single-vertex-flat-foldability.ko/)
