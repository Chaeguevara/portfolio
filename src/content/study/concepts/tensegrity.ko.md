---
type: concept
title: 텐세그리티 (Tensegrity)
lang: ko
pair: "[[tensegrity]]"
course: "6.849"
lectures: [12]
summary: 스트럿(줄어들 수 없음)·케이블(늘어날 수 없음)·막대(고정)로 된 프레임워크. 평형 응력(equilibrium stress)으로 안정화된다.
tags: [linkages, rigidity]
prereqs: [[[infinitesimal-rigidity.ko]]]
related: [[[infinitesimal-rigidity.ko]], [[rigidity.ko]]]
source: [[[L12-tensegrities-carpenter-s-rules]]]
status: draft
---
# 텐세그리티 (Tensegrity)

*(English: [Tensegrity](/portfolio/study/tensegrity/))*

> 스트럿(줄어들 수 없음)·케이블(늘어날 수 없음)·막대(고정)로 된 프레임워크. 평형 응력(equilibrium stress)으로 안정화된다.

## 개념
**텐세그리티(tensegrity)** 는 막대 프레임워크를 **부등식** 부재로 일반화한다:
- **케이블(cable)** 은 줄어들 수 있지만 늘어날 수 없음(거리 ≤ 길이),
- **스트럿(strut)** 은 늘어날 수 있지만 줄어들 수 없음(거리 ≥ 길이),
- **막대(bar)** 는 고정(거리 = 길이).

벅민스터 풀러가 이름 붙인 것으로 유명하며, 스트럿끼리 닿지 않아도 강체일 수 있다 —
장력으로 지탱된다. 강성은 **평형 응력(equilibrium stress)** (모든 관절에서 장력과 압축을
균형 잡는 자기 응력)으로 증명된다.

## 왜 중요한가
텐세그리티는 [무한소 강성](/portfolio/study/infinitesimal-rigidity.ko/)을 한쪽 방향 제약으로 확장해, 케이블-
스트럿 조각, 전개형 구조물, 생물 세포 골격을 모델링한다. 깔끔한 특수 경우 — **거미줄
(spider web)** — 이 **종이접기 테셀레이션**의 알고리즘적 설계로 다시 연결된다.

## 세부
- 검사는 강성 행렬에 응력의 부호 조건을 더해 사용한다(맥스웰-크레모나 / 다면체 들어올림
  쌍대성).
- 물리/수치 구성에서 스프링이 막대를 흉내낼 수 있다.

## 관련
[무한소 강성 (Infinitesimal Rigidity)](/portfolio/study/infinitesimal-rigidity.ko/) · [강성 (Rigidity)](/portfolio/study/rigidity.ko/)
