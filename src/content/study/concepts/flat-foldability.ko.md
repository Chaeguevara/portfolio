---
type: concept
title: 평평 접힘 (Flat-Foldability)
lang: ko
pair: "[[flat-foldability]]"
course: "6.849"
lectures: [2, 3, 7]
summary: 크리스 패턴이 종이가 자기 자신을 통과하지 않으면서 평평한(두께 0) 상태로 접힐 수 있는가의 성질.
tags: [origami, flat-folding]
prereqs: [[[crease-pattern.ko]], [[mountain-valley-assignment.ko]]]
related: [[[single-vertex-flat-foldability.ko]], [[map-folding.ko]], [[flat-foldability-np-hardness.ko]]]
source: [[[L02-simple-folds]], [[L03-single-vertex-crease-patterns]], [[L07-origami-is-hard]]]
status: draft
---
# 평평 접힘 (Flat-Foldability)

*(English: [Flat-Foldability](/portfolio/study/flat-foldability/))*

> 크리스 패턴이 종이가 자기 자신을 통과하지 않으면서 평평한(두께 0) 상태로 접힐 수 있는가의 성질.

## 개념
크리스 패턴이 **평평하게 접힘(flat-foldable)** 이라는 것은, (오직) 그 크리스들을 따라
접어서 결과물이 한 평면 안에 평평하게 놓이고, 어떤 두 종이 층도 서로를 통과하지
않도록 할 수 있다는 뜻이다. 이 문제는 *국소(local)* 질문(각 꼭짓점 따로)과 훨씬 어려운
*전역(global)* 질문(종이 전체 동시)으로 나뉜다.

## 왜 중요한가
평평 접힘은 종이접기의 가장 깔끔한 수학적 모델이며 이후 설계 결과의 토대다. 예술
(테셀레이션), 실용(에어백·지도·태양돛의 콤팩트한 접기), 그리고 [[rigid-origami.ko|강체
종이접기]]로 가는 관문으로서 연구한다.

## 세부
- 한 꼭짓점에서의 **국소** 평평 접힘은 *쉽다* — [가와사키 정리](/portfolio/study/kawasaki-theorem.ko/)
  (각도) + [마에카와 정리](/portfolio/study/maekawa-theorem.ko/)(MV 개수)로 판정.
  ([단일 꼭짓점 평평 접힘 (Single-Vertex Flat-Foldability)](/portfolio/study/single-vertex-flat-foldability.ko/) 참고)
- **전역** 평평 접힘은 일반적으로 **NP-난해**다([평평 접힘의 NP-난해성 (NP-Hardness of Flat Foldability)](/portfolio/study/flat-foldability-np-hardness.ko/)).
  장애물은 일관된 층 순서(layer ordering).
- 다루기 쉬운 특수 경우: 1차원 띠(선형 시간), 2×n 지도. 일반
  [지도 접기](/portfolio/study/map-folding.ko/)는 미해결/어려움.

## 관련
[단일 꼭짓점 평평 접힘 (Single-Vertex Flat-Foldability)](/portfolio/study/single-vertex-flat-foldability.ko/) · [가와사키 정리 (Kawasaki's Theorem)](/portfolio/study/kawasaki-theorem.ko/) · [마에카와 정리 (Maekawa's Theorem)](/portfolio/study/maekawa-theorem.ko/) · [평평 접힘의 NP-난해성 (NP-Hardness of Flat Foldability)](/portfolio/study/flat-foldability-np-hardness.ko/)
