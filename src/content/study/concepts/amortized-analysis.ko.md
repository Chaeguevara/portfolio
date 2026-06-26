---
type: concept
title: 분할상환 분석 (Amortized Analysis)
lang: ko
pair: "[[amortized-analysis]]"
course: "6.046J"
lectures: [10, 11]
summary: 최악 연산 열에 대한 연산당 평균 비용을 총합·회계·퍼텐셜 방법으로 한계 짓는다.
tags: [analysis]
prereqs: []
related: [[[dynamic-array.ko]], [[union-find.ko]], [[competitive-analysis.ko]]]
source: [[[L10-hashing-and-amortization]], [[L11-amortized-analysis]]]
status: draft
---
# 분할상환 분석 (Amortized Analysis)

*(English: [Amortized Analysis](/portfolio/study/amortized-analysis/))*

> 최악 연산 열에 대한 연산당 평균 비용을 총합·회계·퍼텐셜 방법으로 한계 짓는다.

## 개념
어떤 연산은 가끔 비싸지만 임의의 열에 걸쳐 평균적으로 싸다. **분할상환 분석** 은 각 연산에
매끄러운 비용을 매겨 $n$ 연산의 총합이 옳도록 한다 — 개별 비용이 들쭉날쭉해도.

## 왜 중요한가
동적 배열 추가, union-find, 스플레이 트리가 개별 연산은 느려도 *총합으로* 효율적인 이유를
설명한다 — 그 비용을 정직하게 진술하는 법.

## 세부
세 방법: **총합(aggregate)**(총비용/$n$); **회계(accounting)**(싼 연산에 더 매겨 비싼 연산을
위한 크레딧 적립); **퍼텐셜(potential)**(상태에 $\Phi$ 를 정의해 분할상환 비용 $=$ 실제
$+\Delta\Phi$). 모두 같은 한계를 주니 가장 쉬운 것을 택한다.

## 관련
[동적 배열 (Dynamic Arrays)](/portfolio/study/dynamic-array.ko/) · [유니온-파인드 (서로소 집합) (Union-Find)](/portfolio/study/union-find.ko/) · [경쟁 분석 (온라인 알고리즘) (Competitive Analysis)](/portfolio/study/competitive-analysis.ko/)
