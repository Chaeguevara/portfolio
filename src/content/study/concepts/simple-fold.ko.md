---
type: concept
title: 단순 접기 (Simple Fold)
lang: ko
pair: "[[simple-fold]]"
course: "6.849"
lectures: [2]
summary: 한 직선을 따라 모든 층을 ±180°로 접는 것. 가장 제한적이며 제조 친화적인 접기 모델.
tags: [origami, flat-folding, algorithms]
prereqs: [[[crease-pattern.ko]]]
related: [[[map-folding.ko]], [[flat-foldability.ko]], [[flat-foldability-np-hardness.ko]]]
source: [[[L02-simple-folds]]]
status: draft
---
# 단순 접기 (Simple Fold)

*(English: [Simple Fold](/portfolio/study/simple-fold/))*

> 한 직선을 따라 모든 층을 ±180°로 접는 것. 가장 제한적이며 제조 친화적인 접기 모델.

## 개념
**단순 접기(simple fold)** 는 현재(이미 접혀 있을 수도 있는) 종이 더미를 가로지르는 한
직선을 골라, 그 선을 따라 모든 것을 정확히 ±180°로 접는다. 이런 접기의 연속이
*단순 접기 과정(simple folding)* 이다. 이것은 기계(금속·목재·플라스틱 절곡기)가 수행할
수 있는 접기라서 따로 연구한다.

## 왜 중요한가
단순 접기는 "여러 크리스를 한꺼번에 접는" 일반 종이접기 이전의 워밍업이다. 놀랍게도
단순 접기만으로 **임의의 2D 모양**(실루엣)을 접을 수 있고, 약간 더 일반적인 접기로는
임의의 3D 모양까지 가능하다 — 그런데도 주어진 CP의 단순 접힘 가능성 판정은 여전히
**NP-난해**일 수 있다([평평 접힘의 NP-난해성 (NP-Hardness of Flat Foldability)](/portfolio/study/flat-foldability-np-hardness.ko/)).

## 세부
- **1차원 단순 접힘**(띠 위 평행 크리스)은 **선형 시간**에 판정된다 — 수업에서 보인
  깔끔한 알고리즘으로 교과서보다 단순하다.
- 단순 접기로 하는 **2D 지도 접기**(n×n 격자)가 고전적 경우다. 2×n은 다항 시간,
  일반 m×n은 어려움/미해결([지도 접기 (Map Folding)](/portfolio/study/map-folding.ko/)).
- 변종은 한 번의 접기가 몇 개 층을 가로질러도 되는지(전체 층/일부 층)로 갈린다.

## 관련
[지도 접기 (Map Folding)](/portfolio/study/map-folding.ko/) · [평평 접힘 (Flat-Foldability)](/portfolio/study/flat-foldability.ko/) · [평평 접힘의 NP-난해성 (NP-Hardness of Flat Foldability)](/portfolio/study/flat-foldability-np-hardness.ko/)
