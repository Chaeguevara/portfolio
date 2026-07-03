---
type: concept
title: 마에카와 정리 (Maekawa's Theorem)
lang: ko
pair: "[[maekawa-theorem]]"
course: "6.849"
lectures: [3]
summary: 평평하게 접히는 크리스 패턴의 모든 내부 꼭짓점에서 산 수 − 골 수 = ±2.
tags: [origami, flat-folding, theorem]
prereqs: [[[mountain-valley-assignment.ko]]]
related: [[[kawasaki-theorem.ko]], [[single-vertex-flat-foldability.ko]], [[big-little-big-lemma.ko]]]
source: [[[L03-single-vertex-crease-patterns]]]
status: draft
---
# 마에카와 정리 (Maekawa's Theorem)

*(English: [Maekawa's Theorem](/portfolio/study/maekawa-theorem/))*

> 평평하게 접히는 크리스 패턴의 모든 내부 꼭짓점에서 산 수 − 골 수 = ±2.

## 정리
산 크리스 `M`개, 골 크리스 `V`개를 가진 내부 꼭짓점이 평평하게 접히면:

```
|M − V| = 2
```

따라서 꼭짓점 차수가 `2n`이면 가능한 경우는 `(M,V) = (n+1, n−1)` 또는 `(n−1, n+1)`
뿐이다. 이것은 **조합적**(MV 개수) 조건으로, **기하적** 조건인
[가와사키 정리](/portfolio/study/kawasaki-theorem.ko/)와 짝을 이룬다.

## 왜 중요한가
국소 평평 접힘 판정의 절반이다. 두 가지 즉각적 따름:
- **홀수 차수** 꼭짓점은 절대 평평하게 접히지 않는다(M+V가 ±2 차이로 갈려야 하므로
  M+V는 짝수여야 함).
- 한 꼭짓점이 가질 수 있는 유효 [산-골 배정](/portfolio/study/mountain-valley-assignment.ko/) 개수를 제한한다.

## 증명 스케치
꼭짓점 둘레를 한 바퀴 돈다. 산은 "종이 방향"을 한쪽으로, 골은 반대쪽으로 돌린다.
층들이 평평한 더미로 닫히려면 부호 있는 합이 정확히 한 바퀴 여분, 즉 ±2 여야 한다.
(감김/회전 논증)

## 주의
마에카와는 단독으로는 **필요조건이지 충분조건이 아니다** — 각도에 대한
[가와사키 정리](/portfolio/study/kawasaki-theorem.ko/)와, 전역적으로 일관된 층 순서도 필요하다.

## 관련
[가와사키 정리 (Kawasaki's Theorem)](/portfolio/study/kawasaki-theorem.ko/) · [단일 꼭짓점 평평 접힘 (Single-Vertex Flat-Foldability)](/portfolio/study/single-vertex-flat-foldability.ko/) · [큰-작은-큰 보조정리 (Big–Little–Big Lemma)](/portfolio/study/big-little-big-lemma.ko/)
