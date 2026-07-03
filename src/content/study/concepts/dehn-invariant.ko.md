---
type: concept
title: 덴 불변량 (Dehn Invariant)
lang: ko
pair: "[[dehn-invariant]]"
course: "6.849"
lectures: [14]
summary: 두 3D 다면체가 가위 합동(scissors-congruent)이려면 일치해야 하는 대수적 양(변 길이와 이면각으로부터).
tags: [polyhedra, geometry, theorem]
prereqs: []
related: [[[hinged-dissection.ko]]]
source: [[[L14-hinged-dissections]]]
status: draft
---
# 덴 불변량 (Dehn Invariant)

*(English: [Dehn Invariant](/portfolio/study/dehn-invariant/))*

> 두 3D 다면체가 가위 합동(scissors-congruent)이려면 일치해야 하는 대수적 양(변 길이와 이면각으로부터).

## 개념
2D에서는 넓이가 같은 두 다각형은 항상 **가위 합동(scissors-congruent)** 이다(하나를
조각내 다른 것으로 재조립 — 볼리아이-게르빈, Bolyai–Gerwien). 3D에서는 이것이 **실패**한다:
부피가 같은 것으로 충분하지 않다. **덴 불변량(Dehn invariant)** 이 추가 장애물이다 — 각
변에서 (길이) ⊗ (이면각)으로 계산해 특별한 대수 군(`ℝ ⊗_ℚ ℝ/πℚ`)에서 합한 값.

## 왜 중요한가
**힐베르트의 세 번째 문제**를 해결했다: 부피가 같은 정육면체와 정사면체는 덴 불변량이 달라
**가위 합동이 아니다**. 두 다면체가 가위 합동일 필요충분조건은 부피가 같고 **동시에** 덴
불변량이 같은 것이다(Sydler).

## 수업 맥락
**[경첩 분할](/portfolio/study/hinged-dissection.ko/)**을 통해 등장한다: 2D 분할은 유연하고 경첩까지 가능하지만,
3D/4D 분할은 덴 불변량에 제약된다 — 3D 이론이 2D보다 훨씬 어려운 이유.

## 관련
[경첩 분할 (Hinged Dissection)](/portfolio/study/hinged-dissection.ko/)
