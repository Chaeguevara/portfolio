---
type: concept
title: 붙이기 트리 (Gluing Tree)
lang: ko
pair: "[[gluing-tree]]"
course: "6.849"
lectures: [17, 18]
summary: 다각형의 경계가 자기 자신에 어떻게 붙는지를 나타내는 조합적 기술. 알렉산드로프 붙이기를 찾는 탐색 구조.
tags: [polyhedra, algorithms]
prereqs: [[[alexandrov-theorem.ko]]]
related: [[[alexandrov-theorem.ko]], [[d-form.ko]]]
source: [[[L17-alexandrov-s-theorem]], [[L18-gluing-algorithms]]]
status: draft
---
# 붙이기 트리 (Gluing Tree)

*(English: [Gluing Tree](/portfolio/study/gluing-tree/))*

> 다각형의 경계가 자기 자신에 어떻게 붙는지를 나타내는 조합적 기술. 알렉산드로프 붙이기를 찾는 탐색 구조.

## 개념
다각형을 다면체로 접을 때, 다각형의 **둘레가 자기 자신에 붙는다**. **붙이기 트리(gluing
tree)** 는 어느 경계 점이 어느 점과 동일시되는지 — 붙이기의 "솔기(seam)" 구조 — 를 트리로
포착한다. 유효한 **알렉산드로프 붙이기**([알렉산드로프 정리 (Alexandrov's Theorem)](/portfolio/study/alexandrov-theorem.ko/)) 탐색을 다루기 쉽게 만드는
자료구조다.

## 왜 중요한가
[알렉산드로프 정리](/portfolio/study/alexandrov-theorem.ko/)는 *유효한 붙이기가 있으면* 유일한 다면체를
보장하지만, 붙이기를 찾는 것이 알고리즘적 난제다. 붙이기 트리로 이를 열거·계수하고, 몇
개인지 한계를 정할 수 있다.

## 결과
- **둘레 이등분(perimeter halving)** 이 볼록 다각형의 가장 단순한 붙이기다(두 대척점에서
  경계를 자기 자신에 접음).
- **변-대-변(edge-to-edge)** 붙이기: 다항 시간 **동적 계획법(dynamic program)** 이 이를
  판정/열거. 개수는 일반적으로 지수적일 수 있으나, "뾰족함(sharpness)"이 유계인 다각형은
  다항.
- **구르는 띠(rolling belt)** 가 다각형이 무한히 많은 붙이기를 가질 수 있는 메커니즘이다
  (미끄러질 수 있는 띠).
- 사례 연구: 라틴 십자가는 여러 서로 다른 볼록 다면체로 접힌다.

## 관련
[알렉산드로프 정리 (Alexandrov's Theorem)](/portfolio/study/alexandrov-theorem.ko/) · [D-폼 (D-Form)](/portfolio/study/d-form.ko/)
