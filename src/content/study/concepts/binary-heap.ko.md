---
type: concept
title: 이진 힙과 우선순위 큐 (Binary Heaps, Priority Queues)
lang: ko
pair: "[[binary-heap]]"
course: "6.006"
lectures: [8]
summary: 힙 성질을 가진 배열 기반 거의-완전 트리로, O(log n) 삽입과 최소/최대 추출을 준다.
tags: [data-structures, trees]
prereqs: [[[data-structure-interfaces.ko]]]
related: [[[dijkstra.ko]], [[binary-search-tree.ko]]]
source: [[[L08-binary-heaps]]]
status: draft
---
# 이진 힙과 우선순위 큐 (Binary Heaps, Priority Queues)

*(English: [Binary Heaps & Priority Queues](/portfolio/study/binary-heap/))*

> 힙 성질을 가진 배열 기반 거의-완전 트리로, O(log n) 삽입과 최소/최대 추출을 준다.

## 개념
**이진 힙(binary heap)** 은 각 부모가 자식보다 $\le$ (최소 힙)인 완전 이진 트리(배열에 암묵적
저장)다. 최솟값은 루트에 있다. **삽입** 은 위로 떠오르고 **최소 추출** 은 마지막 잎을 루트로
옮겨 아래로 가라앉힌다 — 각각 $O(\log n)$.

## 왜 중요한가
표준 **우선순위 큐** 다: 대기 중 가장 작은/큰 항목을 반복해 꺼낸다. Dijkstra, Prim, 힙정렬,
이벤트 시뮬레이션, 스케줄링을 떠받친다.

## 세부
배열 배치: 노드 $i$ 의 자식은 $2i{+}1,2i{+}2$. $n$ 항목으로 힙 만들기는 $O(n)$ ($n\log n$
아님). **힙정렬** 은 반복 추출로 제자리에서 $O(n\log n)$ 정렬한다.

## 관련
[다익스트라 알고리즘 (Dijkstra's Algorithm)](/portfolio/study/dijkstra.ko/) · [이진 탐색 트리 (Binary Search Trees)](/portfolio/study/binary-search-tree.ko/) · [집합 대 수열 인터페이스 (Set vs Sequence Interfaces)](/portfolio/study/data-structure-interfaces.ko/)
