---
type: concept
title: 근사 알고리즘 (Approximation Algorithms)
lang: ko
pair: "[[approximation-algorithms]]"
course: "6.046J"
lectures: [18]
summary: NP-난해 최적화에 대해 보장된 비율로 다항 시간에 증명 가능하게 최적에 가까운 해를 찾는다.
tags: [complexity, approximation]
prereqs: [[[np-completeness.ko]]]
related: [[[np-completeness.ko]], [[clustering.ko]], [[derandomization.ko]]]
source: [[[L18-polynomial-time-approximations]]]
status: draft
---
# 근사 알고리즘 (Approximation Algorithms)

*(English: [Approximation Algorithms](/portfolio/study/approximation-algorithms/))*

> NP-난해 최적화에 대해 보장된 비율로 다항 시간에 증명 가능하게 최적에 가까운 해를 찾는다.

## 개념
정확한 풀이가 난해할 때 **$\alpha$-근사** 는 다항 시간에 돌며 *모든* 입력에서 최적의 $\alpha$
배 이내 해를 반환한다 — 휴리스틱 기대가 아니라 최악 품질 보장이다.

## 왜 중요한가
NP-난해성에 대한 원칙적 대응이다: 정확성을 증명된 한계와 맞바꾼다. 핵심은 알고리즘 *과* 그
한계를 설계하는 것이며, 흔히 완화(relaxation)나 최적의 하한과 비교한다.

## 세부
**정점 덮개:** 극대 매칭의 양 끝점을 취하면 $2$-근사. **집합 덮개:** 탐욕이 $\ln n$. 어떤
문제는 **PTAS**(임의의 $1+\epsilon$)를 허용하고, 어떤 문제는 P$=$NP 가 아닌 한 어떤 한계 너머로
근사하기 어렵다.

## 관련
[NP-완전성과 환원 (NP-Completeness, Reductions)](/portfolio/study/np-completeness.ko/) · [클러스터링 (Clustering)](/portfolio/study/clustering.ko/) · [비무작위화 (Derandomization)](/portfolio/study/derandomization.ko/)
