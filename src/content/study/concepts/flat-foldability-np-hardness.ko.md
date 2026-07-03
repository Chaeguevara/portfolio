---
type: concept
title: 평평 접힘의 NP-난해성 (NP-Hardness of Flat Foldability)
lang: ko
pair: "[[flat-foldability-np-hardness]]"
course: "6.849"
lectures: [7]
summary: 주어진 크리스 패턴의 전역 평평 접힘 판정은 NP-난해다(Bern & Hayes 1996). 핵심 장애물은 층 순서 제약.
tags: [origami, flat-folding, complexity, theorem]
prereqs: [[[flat-foldability.ko]]]
related: [[[map-folding.ko]], [[simple-fold.ko]], [[tree-method.ko]]]
source: [[[L07-origami-is-hard]]]
status: draft
---
# 평평 접힘의 NP-난해성 (NP-Hardness of Flat Foldability)

*(English: [NP-Hardness of Flat Foldability](/portfolio/study/flat-foldability-np-hardness/))*

> 주어진 크리스 패턴의 전역 평평 접힘 판정은 NP-난해다(Bern & Hayes 1996). 핵심 장애물은 층 순서 제약.

## 정리
*국소* 평평 접힘은 각 꼭짓점에서 쉽지만, 크리스 패턴 전체가 **어떤** 유효한 평평 접힌
상태라도 갖는지 판정하는 것은 일반적으로 **NP-난해**다(Bern & Hayes, 1996). 이
난해성은 [MV 배정](/portfolio/study/mountain-valley-assignment.ko/)이 미리 주어져도 사라지지 않는다.

## 왜 어려운가
각 꼭짓점은 독립적으로 평평하게 접힐 수 있지만, 서로 다른 꼭짓점에서 고른 **층 순서**가
전역적으로 일관되어야 한다 — 어디서도 종이가 종이를 통과해선 안 된다. 이 국소적 쌓기
선택들을 동시에 화해시키는 것이 어려운 조합적(NP-완전) 제약 충족 문제를 인코딩한다.

## 수업에서 증명하는 것
Lecture 7은 NP-난해성을 실용적으로 소개하고 알려진 어려운 문제를 세 종이접기 문제로
환원한다:
1. 주어진 CP를 [단순 접기](/portfolio/study/simple-fold.ko/) 순서로 접기.
2. 주어진 CP를 *임의의* 접힌 상태로 평평하게 접기.
3. 최적 [단축 베이스](/portfolio/study/uniaxial-base.ko/) 설계(목표 트리가 별이어도) — [[tree-method.ko|트리
   방법]]의 원판 채우기(disk packing) 경유.

## 핵심
전역 종이접기 접힘은 국소 이론보다 근본적으로 어렵다. 다루기 쉬운 결과(1차원, 2×n
[지도 접기](/portfolio/study/map-folding.ko/))는 특별히 구조화된 경우다.

## 관련
[평평 접힘 (Flat-Foldability)](/portfolio/study/flat-foldability.ko/) · [지도 접기 (Map Folding)](/portfolio/study/map-folding.ko/) · [단순 접기 (Simple Fold)](/portfolio/study/simple-fold.ko/) · [트리 방법 (Tree Method, 종이접기 설계)](/portfolio/study/tree-method.ko/)
