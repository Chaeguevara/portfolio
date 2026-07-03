---
type: concept
title: 계산 기하 (Computational Geometry)
lang: ko
pair: "[[computational-geometry]]"
course: "6.046J"
lectures: [23]
summary: "기하 대상에 대한 알고리즘: 교차에 스윕 라인, 볼록 껍질, 가장 가까운 쌍."
tags: [geometry]
prereqs: [[[comparison-sorting.ko]]]
related: [[[clustering.ko]]]
source: [[[L23-computational-geometry]]]
status: draft
---
계산 기하 (Computational Geometry)

*(English: [Computational Geometry](/portfolio/study/computational-geometry/))*

> 기하 대상에 대한 알고리즘: 교차에 스윕 라인, 볼록 껍질, 가장 가까운 쌍.

## 개념
기하 문제는 공간적 순서를 이용한다. **스윕 라인(sweep-line)** 기법은 평면을 가로질러 선을
움직이며 사건(끝점, 교차)을 정렬 순서로 처리하고, 선이 현재 닿는 것의 상태 구조를 유지한다.

## 왜 중요한가
그래픽스, GIS, 로보틱스, CAD 의 기반이다. 패러다임(스윕, 좌표에 대한 분할정복)이 기하 알고리즘
전반에 반복된다.

## 세부
**선분 교차:** 좌→우 스윕, 교차 $k$ 개에 $O((n+k)\log n)$. **볼록 껍질:** 그레이엄 스캔 /
앤드루 모노톤 체인으로 $O(n\log n)$. **가장 가까운 쌍:** 분할정복 $O(n\log n)$, 분할선을
가로지르는 얇은 띠만 검사.

## 관련
[클러스터링 (Clustering)](/portfolio/study/clustering.ko/) · [비교 정렬과 그 하한 (Comparison Sorting, Lower Bound)](/portfolio/study/comparison-sorting.ko/)
