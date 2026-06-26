---
type: concept
title: 준선형 시간 알고리즘 (Sublinear-Time Algorithms)
lang: ko
pair: "[[sublinear-algorithms]]"
course: "6.046J"
lectures: [20]
summary: 거대한 입력의 아주 작은 표본만 읽어 입력 크기보다 적은 시간에 근사로 답한다.
tags: [sublinear]
prereqs: [[[randomized-algorithms.ko]]]
related: [[[randomized-algorithms.ko]]]
source: [[[L20-sublinear-time-algorithms]]]
status: draft
---
# 준선형 시간 알고리즘 (Sublinear-Time Algorithms)

*(English: [Sublinear-Time Algorithms](/portfolio/study/sublinear-algorithms/))*

> 거대한 입력의 아주 작은 표본만 읽어 입력 크기보다 적은 시간에 근사로 답한다.

## 개념
거대한 입력에선 전부 읽는 것조차 느리다. **준선형(sublinear)** 알고리즘은 작은 무작위 부분을
표본 추출해 $o(n)$ 시간에 근사적·확률적 답을 낸다 — 입력 대부분을 안 보므로 필연적으로 근사다.

## 왜 중요한가
$O(n)$ 도 감당 못 하는 빅데이터 규모(데이터베이스, 네트워크, 스트림)에서 필수다; 입력이 거대하거나
스트림으로 도착할 때의 현실적 모델.

## 세부
**속성 검사(property testing):** 표본으로 "속성 $P$ 를 가짐"과 "$P$ 를 가진 어떤 것과도 멂"을
구별 — 예: 리스트 정렬 여부, 그래프 이분성 검사. 표본에서 평균·지름·연결 성분 수 추정도.

## 관련
[무작위 알고리즘 (Randomized Algorithms)](/portfolio/study/randomized-algorithms.ko/)
