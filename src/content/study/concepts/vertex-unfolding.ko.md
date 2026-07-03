---
type: concept
title: 꼭짓점 펼치기 (Vertex Unfolding)
lang: ko
pair: "[[vertex-unfolding]]"
course: "6.849"
lectures: [16]
summary: 조각들이 단일 꼭짓점에서만 연결되어도 되는 완화된 펼치기(면들의 경첩 체인처럼).
tags: [polyhedra]
prereqs: [[[edge-unfolding.ko]]]
related: [[[edge-unfolding.ko]], [[hinged-dissection.ko]]]
source: [[[L16-vertex-orthogonal-unfolding]]]
status: draft
---
# 꼭짓점 펼치기 (Vertex Unfolding)

*(English: [Vertex Unfolding](/portfolio/study/vertex-unfolding/))*

> 조각들이 단일 꼭짓점에서만 연결되어도 되는 완화된 펼치기(면들의 경첩 체인처럼).

## 개념
**꼭짓점 펼치기(vertex unfolding)** 는 [변 펼치기](/portfolio/study/edge-unfolding.ko/)를 완화한다: 펼친 면들이
완전한 변이 아니라 공유 **꼭짓점**(점 연결)으로만 연결되어도 된다 — 표면의
[경첩 분할](/portfolio/study/hinged-dissection.ko/)과 비슷하다. 결과는 연속된 면이 한 점에서 닿는, 연결되고
겹치지 않는 평면 배치다.

## 왜 중요한가
변 펼치기(종종 불가능)와 일반 펼치기(아무 데나 자름) 사이에 있다. 변 펼치기가 실패하는
곳에서 **긍정적** 존재 결과를 준다:

- **삼각형 면을 가진 모든 다면체는 꼭짓점 펼치기를 가진다** — 비볼록이어도.
- 그러나 **꼭짓점 펼치기가 없는 위상적 볼록 다면체**가 존재한다(Abel & Demaine 2011).
  그래서 보편적이지는 않다.

## 세부
- 꼭짓점 펼치기는 보통 "선형"(면이 경로/패싯 경로로 엮임)이고 꼭짓점을 다시 방문할 수 있다.
- 관련 직교 다면체 결과: **이차(quadratic)** 세분만으로 하는 일반 펼치기(Damian, Demaine,
  Flatland 2012) — 격자/맨해튼 타워 구조 경유.

## 관련
[변 펼치기 (Edge Unfolding)](/portfolio/study/edge-unfolding.ko/) · [경첩 분할 (Hinged Dissection)](/portfolio/study/hinged-dissection.ko/)
