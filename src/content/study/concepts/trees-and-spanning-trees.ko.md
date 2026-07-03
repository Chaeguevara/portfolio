---
type: concept
title: 트리와 신장 트리 (Trees & Spanning Trees)
lang: ko
pair: "[[trees-and-spanning-trees]]"
course: "6.042J"
lectures: [8]
summary: 트리는 간선이 n-1개인 연결 비순환 그래프이고, 신장 트리는 그래프의 모든 정점을 최소로 잇는다.
tags: [graph-theory, trees]
prereqs: [[[graphs-basics.ko]]]
related: [[[minimum-spanning-tree.ko]], [[graphs-basics.ko]]]
source: [[[L08-graph-theory-ii-minimum-spanning-trees]]]
status: draft
---
# 트리와 신장 트리 (Trees & Spanning Trees)

*(English: [Trees & Spanning Trees](/portfolio/study/trees-and-spanning-trees/))*

> 트리는 간선이 n-1개인 연결 비순환 그래프이고, 신장 트리는 그래프의 모든 정점을 최소로 잇는다.

## 개념
$n$ 정점 **트리(tree)** 는 연결되고 순환이 없으며 간선이 정확히 $n-1$ 개다 — 이 셋 중 둘이면
나머지 하나가 따라온다. $G$ 의 **신장 트리(spanning tree)** 는 모든 정점을 닿는 트리인 부분
그래프다.

## 왜 중요한가
트리는 최소 연결 구조다(간선 하나만 빼도 끊어짐). 신장 트리는 네트워크 설계의 골격이자 MST
알고리즘이 최적화하는 대상이다.

## 세부
모든 연결 그래프는 신장 트리를 가진다(순환의 간선을 지움). 트리에 간선 하나를 더하면 정확히
하나의 순환이 생긴다; 이 **순환 성질(cycle property)** 을 탐욕 MST 알고리즘이 활용한다.

## 관련
[최소 신장 트리 (Minimum Spanning Trees)](/portfolio/study/minimum-spanning-tree.ko/) · [그래프 기초: 보행·경로·연결성](/portfolio/study/graphs-basics.ko/)
