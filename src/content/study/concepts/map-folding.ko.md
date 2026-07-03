---
type: concept
title: 지도 접기 (Map Folding)
lang: ko
pair: "[[map-folding]]"
course: "6.849"
lectures: [2, 7]
summary: M/V 라벨이 붙은 m×n 격자 크리스가 한 칸 더미로 평평하게 접히는지 판정 — 1차원은 쉽고 일반 2차원은 미해결/어려움.
tags: [origami, flat-folding, algorithms, complexity]
prereqs: [[[simple-fold.ko]], [[flat-foldability.ko]]]
related: [[[flat-foldability-np-hardness.ko]], [[simple-fold.ko]]]
source: [[[L02-simple-folds]], [[L07-origami-is-hard]]]
status: draft
---
# 지도 접기 (Map Folding)

*(English: [Map Folding](/portfolio/study/map-folding/))*

> M/V 라벨이 붙은 m×n 격자 크리스가 한 칸 더미로 평평하게 접히는지 판정 — 1차원은 쉽고 일반 2차원은 미해결/어려움.

## 개념
고전적인 **지도 접기(map folding)** 문제: 직사각형 지도가 격자로 미리 접혀 있고 각
크리스가 산 또는 골로 표시되어 있다. 모든 크리스를 따라 접어서 한 칸 크기로 쌓인
정사각형으로 평평하게 만들 수 있는가? 크리스 기하가 고정되어 있어 층 순서만 문제가
되므로, 평평 접힘의 가장 깔끔한 시험대다.

## 현황 (알려진 것)
- **1차원**(띠, 평행 크리스): 선형 시간 판정 가능.
- **2 × n** 지도: 다항 시간(수업에서 강조된 결과).
- **일반 m × n** 지도: 복잡도가 오래된 **미해결** 문제. 일반(비단순) 접기를 쓰면 평평
  접힘의 [난해성](/portfolio/study/flat-foldability-np-hardness.ko/)과 연결된다.

## 왜 중요한가
지도 접기는 *쉬운* 1차원 이론과 *어려운* 일반 이론의 경계에 정확히 놓여 있다. 또한
지도·에어백·판재를 콤팩트하게 접는 실제 공학을 모델링한다.

## 관련
[단순 접기 (Simple Fold)](/portfolio/study/simple-fold.ko/) · [평평 접힘 (Flat-Foldability)](/portfolio/study/flat-foldability.ko/) · [평평 접힘의 NP-난해성 (NP-Hardness of Flat Foldability)](/portfolio/study/flat-foldability-np-hardness.ko/)
