---
type: concept
title: 박스 플리팅과 보편 힌지 패턴 (Box Pleating)
lang: ko
pair: "[[box-pleating]]"
course: "6.849"
lectures: [4, 7]
summary: 45°/90° 격자 위에서 설계해, 하나의 고정된 힌지 패턴으로 임의의 정육면체 복합체(polycube) 모양을 접는 방법.
tags: [origami, design]
prereqs: [[[tree-method.ko]]]
related: [[[tree-method.ko]], [[flat-foldability-np-hardness.ko]]]
source: [[[L04-efficient-origami-design]], [[L07-origami-is-hard]]]
status: draft
---
# 박스 플리팅과 보편 힌지 패턴 (Box Pleating)

*(English: [Box Pleating & Universal Hinge Patterns](/portfolio/study/box-pleating/))*

> 45°/90° 격자 위에서 설계해, 하나의 고정된 힌지 패턴으로 임의의 정육면체 복합체(polycube) 모양을 접는 방법.

## 개념
**박스 플리팅(box pleating)** 은 모든 크리스를 45° 대각선이 있는 정사각 격자로 제한한다.
그 힘: **하나의 보편 힌지 패턴(universal hinge pattern)** (고정된 크리스 집합 하나)의
부분집합들이 정육면체로 만든 *임의의* 직교 모양(**폴리큐브, polycube**)을 접는다. 모델마다
새 크리스 패턴을 만드는 대신, 한 패턴을 재사용하고 어느 크리스를 접을지만 고른다.

## 왜 중요한가
인상적인 *보편성(universality)* 결과다(Lecture 7): `n`개 정육면체를 `O(n) × O(n)`
정사각형에서 접는다. **직교 미로(orthogonal maze)** 특수 경우는 종이를 거의 낭비하지
않는다 — 원래 종이보다 작은 상수 배만큼만 작게 접힘("Maze Folder" 시도). *Origami
Design Secrets* 의 격자 정렬·이산화된 [트리 방법](/portfolio/study/tree-method.ko/) 형태이기도 하다.

## 세부
- 보편 힌지 패턴은 효율을 재사용성·예측가능성과 맞바꾼다.
- 박스 플리팅은 많은 현대 테셀레이션·모듈러 설계의 바탕이다.

## 관련
[트리 방법 (Tree Method, 종이접기 설계)](/portfolio/study/tree-method.ko/) · [평평 접힘의 NP-난해성 (NP-Hardness of Flat Foldability)](/portfolio/study/flat-foldability-np-hardness.ko/)
