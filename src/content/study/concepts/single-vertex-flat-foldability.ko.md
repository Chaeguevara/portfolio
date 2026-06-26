---
type: concept
title: 단일 꼭짓점 평평 접힘 (Single-Vertex Flat-Foldability)
lang: ko
pair: "[[single-vertex-flat-foldability]]"
course: "6.849"
lectures: [3]
summary: "한 내부 꼭짓점이 평평하게 접힐 수 있는지 판정하는 것 — 쉬움: 짝수 차수·가와사키·마에카와·층 순서 확인."
tags: [origami, flat-folding, algorithms]
prereqs: [[[kawasaki-theorem.ko]], [[maekawa-theorem.ko]]]
related: [[[big-little-big-lemma.ko]], [[flat-foldability.ko]], [[flat-foldability-np-hardness.ko]]]
source: [[[L03-single-vertex-crease-patterns]]]
status: draft
---
단일 꼭짓점 평평 접힘 (Single-Vertex Flat-Foldability)

*(English: [Single-Vertex Flat-Foldability](/portfolio/study/single-vertex-flat-foldability/))*

> 한 내부 꼭짓점이 평평하게 접힐 수 있는지 판정하는 것 — 쉬움: 짝수 차수·가와사키·마에카와·층 순서 확인.

## 개념
"국소(local)" 평평 접힘은 한 내부 꼭짓점만 떼어내고 나머지 종이는 무시한다. 전역
문제와 달리 이것은 **알고리즘적으로 쉽다**(선형 시간). 이것은 기본 단위다: 크리스
패턴이 평평하게 접히려면 *모든* 꼭짓점이 국소적으로 접혀야 한다.

## 조건 (한 꼭짓점에 대한 필요충분)
1. **짝수 차수** — 크리스 `2n`개([마에카와 정리](/portfolio/study/maekawa-theorem.ko/)의 따름, 아니면 불가).
2. **[가와사키 정리](/portfolio/study/kawasaki-theorem.ko/)** — 교대 각 합이 각각 180°.
3. [마에카와](/portfolio/study/maekawa-theorem.ko/) `|M−V|=2` **및** 일관된 층 순서(자기 통과 없음)를
   만족하는 유효 [산-골 배정](/portfolio/study/mountain-valley-assignment.ko/)이 존재.

[큰-작은-큰 보조정리](/portfolio/study/big-little-big-lemma.ko/)가 그런 MV 배정을 효율적으로 찾거나(없음을
증명하는) 탐욕적 강제 규칙을 제시한다.

## 왜 "국소는 쉽고 전역은 어려운가"
단일 꼭짓점은 쐐기들의 원형 더미 하나만 순서 매기면 된다 — 국소 1차원 문제. 여러
꼭짓점에 걸치면 층 순서들이 동시에 일치해야 하고, 그래서 전역 문제가
[NP-난해](/portfolio/study/flat-foldability-np-hardness.ko/)가 된다.

## 관련
[가와사키 정리 (Kawasaki's Theorem)](/portfolio/study/kawasaki-theorem.ko/) · [마에카와 정리 (Maekawa's Theorem)](/portfolio/study/maekawa-theorem.ko/) · [큰-작은-큰 보조정리 (Big–Little–Big Lemma)](/portfolio/study/big-little-big-lemma.ko/) · [평평 접힘 (Flat-Foldability)](/portfolio/study/flat-foldability.ko/)
