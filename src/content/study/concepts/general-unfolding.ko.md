---
type: concept
title: "일반 펼치기 (General Unfolding: Source & Star)"
lang: ko
pair: "[[general-unfolding]]"
course: "6.849"
lectures: [15]
summary: 면을 가로지르는 자름을 허용하는 펼치기. 볼록 다면체는 소스 또는 별 펼치기로 항상 하나가 존재한다.
tags: [polyhedra, algorithms]
prereqs: [[[polyhedron-unfolding.ko]]]
related: [[[polyhedron-unfolding.ko]], [[edge-unfolding.ko]]]
source: [[[L15-general-edge-unfolding]]]
status: draft
---
일반 펼치기 (General Unfolding: Source & Star)

*(English: [General Unfolding (Source & Star)](/portfolio/study/general-unfolding/))*

> 면을 가로지르는 자름을 허용하는 펼치기. 볼록 다면체는 소스 또는 별 펼치기로 항상 하나가 존재한다.

## 개념
**일반 펼치기(general unfolding)** 는 [변 펼치기](/portfolio/study/edge-unfolding.ko/)를 완화해, 자름이 변뿐
아니라 **면 내부를 가로질러** 가는 것을 허용한다. 이 자유로 *모든 볼록 다면체*를 겹침 없이
펼칠 수 있다 — 두 가지 구성적 방법이 이를 해낸다.

## 두 고전적 구성
- **소스 펼치기(source unfolding):** 표면 위 소스 점 `x`를 고르고, **능선 트리(ridge
  tree)** (`x`로 돌아가는 최단 경로가 둘 이상인 점들의 집합)를 따라 자른다. 남은 것이 겹침
  없이 펼쳐진다. 각 표면 점이 `x`로부터의 측지 거리/방향으로 매핑된다.
- **별 펼치기(star unfolding):** 대신 **`x`에서 모든 꼭짓점으로 가는 최단 경로**를 따라
  자른다. 역시 겹치지 않음이 증명됨(더 어려운 증명).

## 왜 중요한가
두 영역을 깔끔히 분리한다: **볼록 다면체의 일반 펼치기는 해결**(항상 가능)인 반면, 볼록
다면체의 **변** 펼치기는 미해결로 남아 있다. 변종으로 **선 펼치기(sun unfolding)**, **지퍼
펼치기(zipper unfolding)** (자름이 하나의 경로), **연속 개화(continuous blooming)** (겹침
없는 연속 운동으로 펼치기)가 있다.

## 관련
[다면체 펼치기 (Polyhedron Unfolding)](/portfolio/study/polyhedron-unfolding.ko/) · [변 펼치기 (Edge Unfolding)](/portfolio/study/edge-unfolding.ko/)
