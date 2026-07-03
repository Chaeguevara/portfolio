---
type: concept
title: 뾰족 유사삼각분할 (Pointed Pseudotriangulation)
lang: ko
pair: "[[pseudotriangulation]]"
course: "6.849"
lectures: [13]
summary: 유사삼각형(볼록 꼭짓점 3개)으로의 평면 분할로 모든 꼭짓점이 뾰족함. 그 역학이 목수자 펼치기를 구동한다.
tags: [linkages, geometry, algorithms]
prereqs: [[[carpenters-rule-theorem.ko]], [[rigidity.ko]]]
related: [[[carpenters-rule-theorem.ko]], [[locked-linkage.ko]], [[rigidity.ko]]]
source: [[[L13-locked-linkages]]]
status: draft
---
# 뾰족 유사삼각분할 (Pointed Pseudotriangulation)

*(English: [Pointed Pseudotriangulation](/portfolio/study/pseudotriangulation/))*

> 유사삼각형(볼록 꼭짓점 3개)으로의 평면 분할로 모든 꼭짓점이 뾰족함. 그 역학이 목수자 펼치기를 구동한다.

## 개념
**유사삼각형(pseudotriangle)** 은 볼록(내각 < 180°) 꼭짓점이 정확히 3개인 다각형이고
나머지는 오목(reflex)이다. **뾰족 유사삼각분할(pointed pseudotriangulation)** 은 점
집합/다각형을 유사삼각형으로 분할하되 모든 꼭짓점이 **뾰족(pointed)** 하도록 한다(그
꼭짓점의 변들이 어떤 반평면 안에 들어감, 즉 오목한 "틈"이 있음). 이것은 특히 좋은 운동
성질을 가진 최소 강체 프레임워크다.

## 왜 중요한가
[목수자 정리](/portfolio/study/carpenters-rule-theorem.ko/)의 증명/알고리즘 엔진이다: 볼록 껍질 변 하나를
제거하면 자유도가 정확히 1인 기구가 되고, 그 운동이 **확장적(expansive)** 이다 — 그래서
체인을 자기교차 없이 펼친다. 체인의 확장 운동은 모든 확장 운동의 원뿔(cone)의 "극단
광선(extreme ray)"과 정확히 일치하며, 뾰족 유사삼각분할이 이를 실현한다.

## 세부
- 변/면의 개수가 *고정*되어 있고(삼각분할과 달리), 최소 일반 [강체](/portfolio/study/rigidity.ko/)다.
- 모든 평면 최소 일반 강체 그래프는 뾰족 유사삼각분할로 그릴 수 있다(보편성 결과).
- 원래 다각형 광선 쏘기(ray-shooting) 자료구조용으로 도입되었다.

## 관련
[목수자 정리 (Carpenter's Rule Theorem)](/portfolio/study/carpenters-rule-theorem.ko/) · [갇힌 링크 (Locked Linkage)](/portfolio/study/locked-linkage.ko/) · [강성 (Rigidity)](/portfolio/study/rigidity.ko/)
