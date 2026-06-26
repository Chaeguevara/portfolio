---
type: concept
title: 라만 정리 (Laman's Theorem)
lang: ko
pair: "[[laman-theorem]]"
course: "6.849"
lectures: [11]
summary: 그래프가 2D에서 최소 일반 강체일 필요충분조건은 변이 2n−3개이고 모든 k-꼭짓점 부분집합이 최대 2k−3개의 변을 가지는 것.
tags: [linkages, rigidity, theorem, algorithms]
prereqs: [[[rigidity.ko]]]
related: [[[rigidity.ko]], [[infinitesimal-rigidity.ko]]]
source: [[[L11-rigidity-theory]]]
status: draft
---
# 라만 정리 (Laman's Theorem)

*(English: [Laman's Theorem](/portfolio/study/laman-theorem/))*

> 그래프가 2D에서 최소 일반 강체일 필요충분조건은 변이 2n−3개이고 모든 k-꼭짓점 부분집합이 최대 2k−3개의 변을 가지는 것.

## 정리
`n`개 꼭짓점 그래프에 대해, 프레임워크가 **평면에서 최소 일반 강체**일 필요충분조건:
- 변이 정확히 `2n − 3`개이고, **그리고**
- `k`개 꼭짓점의 모든 부분집합이 최대 `2k − 3`개의 변을 유도(과보강 부분그래프 없음
  조건, k ≥ 2).

`2n − 3`은 전체 자유도(`2n`)에서 자명한 평면 운동 3개(평행이동 2 + 회전 1)를 뺀 것이다.

## 왜 중요한가
*기하* 질문(강성)을 순수 *조합적* 변 개수 조건으로 바꿔, **알고리즘적으로** 다항 시간에
확인할 수 있게 한다 — **페블 게임(pebble game)** 이 대략 이차 시간에 수행한다.
**헤네베르크 정리(Henneberg, 1911)** 와 대비된다 — 역시 2D 특징이지만 알고리즘으로
만들기 더 어렵다.

## 세부
- 페블 게임은 "페블"을 변을 따라 보내며 `2k − 3`(및 더 단순한 `2k`) 희소 조건을 검사한다.
- 확장: 그래프를 강체 성분으로 분해, 바디-앤-바(body-and-bar) 프레임워크, 각 제약.
- **3D는 실패**: 유사한 `3n − 6` 개수는 필요하지만 충분하지 않다(더블 바나나 반례).
  3D에서는 라만 형태의 정리가 알려져 있지 않다.

## 관련
[강성 (Rigidity)](/portfolio/study/rigidity.ko/) · [무한소 강성 (Infinitesimal Rigidity)](/portfolio/study/infinitesimal-rigidity.ko/)
