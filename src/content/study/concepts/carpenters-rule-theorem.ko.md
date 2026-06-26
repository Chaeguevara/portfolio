---
type: concept
title: 목수자 정리 (Carpenter's Rule Theorem)
lang: ko
pair: "[[carpenters-rule-theorem]]"
course: "6.849"
lectures: [12]
summary: 임의의 평면 열린 체인이나 단순 다각형은 자기교차 없이 곧게 펴거나 볼록화할 수 있다 — 2D 체인은 절대 갇히지 않는다.
tags: [linkages, theorem]
prereqs: [[[linkage.ko]], [[configuration-space.ko]]]
related: [[[locked-linkage.ko]], [[pseudotriangulation.ko]], [[hinged-dissection.ko]]]
source: [[[L12-tensegrities-carpenter-s-rules]]]
status: draft
---
# 목수자 정리 (Carpenter's Rule Theorem)

*(English: [Carpenter's Rule Theorem](/portfolio/study/carpenters-rule-theorem/))*

> 임의의 평면 열린 체인이나 단순 다각형은 자기교차 없이 곧게 펴거나 볼록화할 수 있다 — 2D 체인은 절대 갇히지 않는다.

## 정리
**평면 열린 체인**(교차 없는 막대 경로)은 항상 **곧게 펼 수 있고(straighten)**, **단순
다각형**(닫힌 체인)은 항상 **볼록화(convexify)** 할 수 있다 — 막대가 절대 교차하지 않는
연속 운동으로. 동치로: **2D 체인은 갇힐 수 없다** — 그 [구성 공간](/portfolio/study/configuration-space.ko/)이
연결되어 있다.

## 왜 중요한가
Demaine의 박사 논문 결과이자 [갇힌 링크](/portfolio/study/locked-linkage.ko/) 이론의 관문이다. "2D 로봇 팔은
항상 펼 수 있나?" — 그렇다 — 에 깔끔히 답하고, 체인이 *갇힐 수* 있는 3D와 뚜렷이
대비된다.

## 증명 아이디어 — 확장 운동(expansive motion)
**확장적** 운동이 존재한다: 모든 꼭짓점 쌍 사이 거리가 비감소인 운동. 확장은 자기교차를
금지한다(교차하려면 어떤 쌍이 가까워져야 함). 이런 운동은 **뾰족
[유사삼각분할](/portfolio/study/pseudotriangulation.ko/)** 이 만들어내며, 그 역학에서 알고리즘이 나온다. 에너지
기반의 또 다른 방법도 있다.

## 현상의 경계
- 2D **트리**(체인이 아닌)는 *갇힐 수* 있다 — 이 정리는 체인에 특수하다.
- 4D 이상 열린 체인은 갇힐 수 없다(움직일 여유).
- 확장성 아이디어는 [경첩 분할](/portfolio/study/hinged-dissection.ko/)("가느다란 장식")에서 재등장한다.

## 관련
[갇힌 링크 (Locked Linkage)](/portfolio/study/locked-linkage.ko/) · [뾰족 유사삼각분할 (Pointed Pseudotriangulation)](/portfolio/study/pseudotriangulation.ko/) · [구성 공간 (Configuration Space)](/portfolio/study/configuration-space.ko/)
