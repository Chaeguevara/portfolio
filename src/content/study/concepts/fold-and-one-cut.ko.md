---
type: concept
title: 접고 한 번 자르기 (Fold-and-One-Cut)
lang: ko
pair: "[[fold-and-one-cut]]"
course: "6.849"
lectures: [8]
summary: 종이를 평평하게 접어, 단 한 번의 직선 자르기로 원하는 임의의 다각형 배치/선 그림을 만드는 것.
tags: [origami, design, algorithms]
prereqs: [[[crease-pattern.ko]]]
related: [[[universal-molecule.ko]], [[tree-method.ko]]]
source: [[[L08-fold-one-cut]]]
status: draft
---
# 접고 한 번 자르기 (Fold-and-One-Cut)

*(English: [Fold-and-One-Cut](/portfolio/study/fold-and-one-cut/))*

> 종이를 평평하게 접어, 단 한 번의 직선 자르기로 원하는 임의의 다각형 배치/선 그림을 만드는 것.

## 개념
**접고 한 번 자르기 정리(fold-and-one-cut theorem)**: 임의의 직선 선분 집합(예: 임의
다각형 모음의 변들, 알파벳 글자)은 종이를 평평하게 접고 **단 한 번의 완전한 직선
자르기**로 만들 수 있다. 접기가 원하는 모든 자를 선분을 하나의 직선 위에 정렬시킨다.

## 왜 중요한가
수 세기에 걸친 퍼즐(1700년대로 거슬러; 후디니의 유명한 마술)이 정리와 알고리즘이 되었다
— Demaine의 첫 계산 종이접기 연구. 에어백 **평탄화(flattening)** 와 [[tree-method.ko|트리
방법]]의 설계 기계와 연결된다.

## 두 방법
1. **직선 골격 방법(straight-skeleton method)** — [보편 몰리큘](/portfolio/study/universal-molecule.ko/)을
   비볼록 다각형으로 일반화하여 직선 골격으로 자를 변들을 정렬. "그림자 트리" 제어를 잃음.
2. **원판 채우기 방법(disk-packing method)** — 원판을 채우고(강 없음) 삼각형/사각형에
   보편 몰리큘 사용.

## 세부
- 수학적 자르기는 홀수 차수 꼭짓점을 허용한다. 실제 가위 자르기는 보통 두 번으로 흉내낸다.
- 최근 파생: [단순 접기](/portfolio/study/simple-fold.ko/)만으로 만들 수 있는 모양은?

## 관련
[보편 몰리큘 (Universal Molecule)](/portfolio/study/universal-molecule.ko/) · [트리 방법 (Tree Method, 종이접기 설계)](/portfolio/study/tree-method.ko/) · [단순 접기 (Simple Fold)](/portfolio/study/simple-fold.ko/)
