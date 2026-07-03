---
type: concept
title: 갇힌 링크 (Locked Linkage)
lang: ko
pair: "[[locked-linkage]]"
course: "6.849"
lectures: [13]
summary: 자기교차 없이 (곧게 펴거나 볼록화하려) 연속적으로 빠져나올 수 없는 구성에 갇힌 링크.
tags: [linkages]
prereqs: [[[configuration-space.ko]], [[carpenters-rule-theorem.ko]]]
related: [[[carpenters-rule-theorem.ko]], [[pseudotriangulation.ko]], [[fixed-angle-linkage.ko]]]
source: [[[L13-locked-linkages]]]
status: draft
---
# 갇힌 링크 (Locked Linkage)

*(English: [Locked Linkage](/portfolio/study/locked-linkage/))*

> 자기교차 없이 (곧게 펴거나 볼록화하려) 연속적으로 빠져나올 수 없는 구성에 갇힌 링크.

## 개념
링크가 **갇혔다(locked)** 는 것은, 현재 구성이 어떤 교차 없는 운동으로도 "표준" 펼친
상태(곧은 체인 / 볼록 다각형)에 도달할 수 없는 [구성 공간](/portfolio/study/configuration-space.ko/) 성분에
있다는 뜻이다. 직관적으로 엉켜 있어, 막대를 서로 통과시키지 않고는 풀려날 수 없다.

## 왜 중요한가
갇힘은 [목수자 정리](/portfolio/study/carpenters-rule-theorem.ko/)가 *2D에서 배제하는* 장애물이다 — 그러나
3D와 트리에서는 다시 나타난다. 무엇이 갇힐 수 있는지 알면 어떤 기구/로봇 팔/분자가
끼일 수 있는지 알 수 있다.

## 무엇이 갇히고 무엇이 안 갇히나
- **2D 열린 체인 & 단순 다각형:** 절대 안 갇힘(목수자 정리).
- **2D 트리:** *갇힐 수* 있음 — 어떤 것이 갇히는지 최근 큰 진전.
- **3D 열린 체인:** *갇힐 수* 있음(고전적 "뜨개바늘(knitting needles)" 예).
- **4D 이상 열린 체인:** 절대 안 갇힘.
- 갇힘 증명은 **무한소 갇힘(infinitesimally locked)** 링크와 "규칙 1, 2"를 쓴다.
  풀기는 [유사삼각분할](/portfolio/study/pseudotriangulation.ko/)/에너지 알고리즘을 쓴다.

## 관련
[목수자 정리 (Carpenter's Rule Theorem)](/portfolio/study/carpenters-rule-theorem.ko/) · [뾰족 유사삼각분할 (Pointed Pseudotriangulation)](/portfolio/study/pseudotriangulation.ko/) · [고정각 링크 (Fixed-Angle Linkage, 단백질 접힘)](/portfolio/study/fixed-angle-linkage.ko/)
