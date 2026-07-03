---
type: concept
title: 불변량과 상태 기계 (Invariants & State Machines)
lang: ko
pair: "[[invariants-and-state-machines]]"
course: "6.042J"
lectures: [3]
summary: 과정을 상태와 전이로 모델링하고, 보존되는 불변량으로 도달 가능/불가능한 것을 증명한다.
tags: [proofs, invariants]
prereqs: [[[induction.ko]]]
related: [[[strong-induction.ko]]]
source: [[[L03-strong-induction]]]
status: draft
---
# 불변량과 상태 기계 (Invariants & State Machines)

*(English: [Invariants & State Machines](/portfolio/study/invariants-and-state-machines/))*

> 과정을 상태와 전이로 모델링하고, 보존되는 불변량으로 도달 가능/불가능한 것을 증명한다.

## 개념
**상태 기계(state machine)** 는 시작 상태와 전이 규칙을 가진다. **불변량(invariant)** 은
시작에서 참이고 **모든 전이에서 보존되는** 성질이라, 도달 가능한 모든 상태에서 성립한다
(단계 수에 대한 귀납법).

## 왜 중요한가
알고리즘·과정이 나쁜 상태에 *도달할 수 없음* 을 증명하는 표준 도구다: 도달 가능한 어떤
상태도 "잘못된 종료"를 만족하지 않으면 그 과정은 올바르다.

## 세부
대표 퍼즐: 15-퍼즐 해결 가능성(패리티 불변량), 대각선만 움직이는 로봇(한 색에 머묾), 동전
게임. 프로그램 정당성의 루프 불변량도 같은 아이디어다.

## 관련
[수학적 귀납법 (Mathematical Induction)](/portfolio/study/induction.ko/) · [강한 귀납법 (Strong Induction)](/portfolio/study/strong-induction.ko/)
