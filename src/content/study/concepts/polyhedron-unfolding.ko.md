---
type: concept
title: 다면체 펼치기 (Polyhedron Unfolding)
lang: ko
pair: "[[polyhedron-unfolding]]"
course: "6.849"
lectures: [15]
summary: 다면체 표면을 잘라 겹치지 않는 하나의 평평한 조각(전개도, net)으로 펼치는 것.
tags: [polyhedra]
prereqs: []
related: [[[edge-unfolding.ko]], [[general-unfolding.ko]], [[vertex-unfolding.ko]]]
source: [[[L15-general-edge-unfolding]]]
status: draft
---
# 다면체 펼치기 (Polyhedron Unfolding)

*(English: [Polyhedron Unfolding](/portfolio/study/polyhedron-unfolding/))*

> 다면체 표면을 잘라 겹치지 않는 하나의 평평한 조각(전개도, net)으로 펼치는 것.

## 개념
다면체를 **펼친다(unfold)** 는 것은 표면을 어떤 곡선들을 따라 잘라, 표면이 평면으로 하나의
연결된 **비겹침(non-overlapping)** 평평 조각(**전개도, net**)으로 열리게 하는 것이다 —
그러면 판재에서 잘라 다시 접을 수 있다. 종이접기와 달리 표면의 어느 부분도 두 번 덮으면
**안 된다**.

## 큰 미해결 문제
1. **모든 볼록 다면체**가 **[변 펼치기](/portfolio/study/edge-unfolding.ko/)**(변만 따라 자름)를 가지나?
   ~1525년(뒤러) 이래 미해결 — 이 분야 가장 오래된 문제.
2. **모든 다면체**(경계 없음)가 **[일반 펼치기](/portfolio/study/general-unfolding.ko/)**(면을 가로지르는
   자름 허용)를 가지나? 손꼽히는 미해결 문제.

## 알려진 것
- 볼록 다면체의 **일반 펼치기**: 항상 가능(소스/별 펼치기, source/star unfolding).
- 일반(비볼록) 다면체의 **변 펼치기**: **실패할 수** 있음 — 변-펼침불가 예가 존재.
  직교 다면체의 변 펼침 가능성 판정은 **NP-완전**.
- 곡률이 핵심 불변량: 총 각결손(angle defect) = 4π(가우스-보네). 그래서 전개도는 구멍을
  가질 수 없다.

## 관련
[변 펼치기 (Edge Unfolding)](/portfolio/study/edge-unfolding.ko/) · [일반 펼치기 (General Unfolding: Source & Star)](/portfolio/study/general-unfolding.ko/) · [꼭짓점 펼치기 (Vertex Unfolding)](/portfolio/study/vertex-unfolding.ko/)
