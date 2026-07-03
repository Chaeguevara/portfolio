---
type: concept
title: 판 엠더 보아스 트리 (van Emde Boas Trees)
lang: ko
pair: "[[van-emde-boas]]"
course: "6.046J"
lectures: [15]
summary: 크기 u 우주 위의 재귀 구조로 선행/후속 연산을 O(log log u)에 제공한다.
tags: [data-structures]
prereqs: [[[binary-search-tree.ko]]]
related: [[[binary-search-tree.ko]]]
source: [[[L15-van-emde-boas-data-structure]]]
status: draft
---
# 판 엠더 보아스 트리 (van Emde Boas Trees)

*(English: [van Emde Boas Trees](/portfolio/study/van-emde-boas/))*

> 크기 u 우주 위의 재귀 구조로 선행/후속 연산을 O(log log u)에 제공한다.

## 개념
$\{0,\dots,u-1\}$ 정수 키에 대해 **vEB 트리** 는 우주를 크기 $\sqrt u$ 인 $\sqrt u$ 개
클러스터로 나누고, 어느 클러스터가 비지 않았는지에 대한 요약 구조를 둔다. 각 연산은 하나의
$\sqrt u$ 크기 하위 구조로 재귀한다.

## 왜 중요한가
우주가 알려진 유계 정수 키의 순서 연산 — 삽입·삭제·멤버·**선행/후속** — 에서 비교 기반
$O(\log n)$ 을 이긴다.

## 세부
점화식 $T(u)=T(\sqrt u)+O(1)$ 이 $O(\log\log u)$ 로 풀린다. 추가 재귀를 피하려 min/max 를
특별히 저장한다. 공간은 $O(u)$(해싱으로 $O(n)$ 축소 가능). 정수 키의 속도를 위해 일반성을
포기한다.

## 관련
[이진 탐색 트리 (Binary Search Trees)](/portfolio/study/binary-search-tree.ko/)
