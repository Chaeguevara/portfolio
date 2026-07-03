---
type: concept
title: 평면 그래프와 오일러 공식 (Planar Graphs, Euler's Formula)
lang: ko
pair: "[[planar-graphs]]"
course: "6.042J"
lectures: [10]
summary: 평면 그래프는 교차 없이 그릴 수 있고, 정점·간선·면이 v - e + f = 2를 만족한다.
tags: [graph-theory]
prereqs: [[[graphs-basics.ko]]]
related: [[[graph-coloring.ko]]]
source: [[[L10-graph-theory-iii]]]
status: draft
---
# 평면 그래프와 오일러 공식 (Planar Graphs, Euler's Formula)

*(English: [Planar Graphs & Euler's Formula](/portfolio/study/planar-graphs/))*

> 평면 그래프는 교차 없이 그릴 수 있고, 정점·간선·면이 v - e + f = 2를 만족한다.

## 개념
간선 교차 없이 평면에 그릴 수 있으면 **평면 그래프(planar)**. 그런 그림은 평면을
**면(face)** 으로 나누며, **오일러 공식** 은 연결 평면 그림에서 $v-e+f=2$ 라고 말한다.

## 왜 중요한가
평면 그래프의 간선 수를 제한하고($e\le 3v-6$), 낮은 차수 정점의 존재를 강제하며, $K_5$ 와
$K_{3,3}$ 의 비평면성과 평면 그래프의 5색 가능성에 대한 짧은 증명을 준다.

## 세부
$e\le 3v-6$ 에서 모든 평면 그래프는 차수 $\le 5$ 정점을 가지며, 이에 대한 귀납으로 5색 정리가
나온다. 완전한 4색 정리는 컴퓨터 보조 증명이 필요하다.

## 관련
[그래프 색칠 (Graph Coloring)](/portfolio/study/graph-coloring.ko/) · [그래프 기초: 보행·경로·연결성](/portfolio/study/graphs-basics.ko/)
