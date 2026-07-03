---
type: concept
title: 변 펼치기 (Edge Unfolding)
lang: ko
pair: "[[edge-unfolding]]"
course: "6.849"
lectures: [15, 16]
summary: 모든 자름이 다면체 변을 따라가는 펼치기. 모든 볼록 다면체에 대한 존재는 유명한 미해결 문제.
tags: [polyhedra, complexity]
prereqs: [[[polyhedron-unfolding.ko]]]
related: [[[polyhedron-unfolding.ko]], [[general-unfolding.ko]], [[vertex-unfolding.ko]]]
source: [[[L15-general-edge-unfolding]], [[L16-vertex-orthogonal-unfolding]]]
status: draft
---
# 변 펼치기 (Edge Unfolding)

*(English: [Edge Unfolding](/portfolio/study/edge-unfolding/))*

> 모든 자름이 다면체 변을 따라가는 펼치기. 모든 볼록 다면체에 대한 존재는 유명한 미해결 문제.

## 개념
**변 펼치기(edge unfolding)** 는 자름을 다면체의 **변(edge)** 으로 제한한
[다면체 펼치기](/portfolio/study/polyhedron-unfolding.ko/)다(면 내부를 가로질러 자르지 않음). 자른 변들은
다면체 변 그래프의 신장 트리(spanning tree)를 이루고, 나머지 변이 전개도의 접는 선이 된다.

## 왜 중요한가
실용적이고 고전적인 개념이다(종이공예 / Pepakura). 핵심 질문 — **모든 볼록 다면체가 변
펼치기를 가지나?** — 은 뒤러(1525) 이래 미해결로 남아 있다.

## 알려진 것
- **볼록 다면체:** 일반적으로 미해결. 많은 특수 부류는 변 펼침이 증명됨.
- **비볼록 다면체:** **변-펼침불가**일 수 있음(모든 변 펼치기가 겹침). 가장 작은 알려진
  예는 ~13면(최소로 추측).
- 위상적으로 볼록한 **직교** 다면체의 변 펼침 가능성 판정은 **NP-완전**. Pepakura의 무차별
  휴리스틱이 실제로는 괜찮게 작동.

## 관련
[다면체 펼치기 (Polyhedron Unfolding)](/portfolio/study/polyhedron-unfolding.ko/) · [일반 펼치기 (General Unfolding: Source & Star)](/portfolio/study/general-unfolding.ko/) · [꼭짓점 펼치기 (Vertex Unfolding)](/portfolio/study/vertex-unfolding.ko/)
