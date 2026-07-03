---
type: concept
title: 이진 탐색 트리 (Binary Search Trees)
lang: ko
pair: "[[binary-search-tree]]"
course: "6.006"
lectures: [6]
summary: BST 성질(왼쪽<노드<오른쪽)을 유지하는 트리로, 순서 있는 집합 연산을 O(높이)에 지원한다.
tags: [data-structures, trees]
prereqs: [[[data-structure-interfaces.ko]]]
related: [[[avl-tree.ko]], [[binary-heap.ko]]]
source: [[[L06-binary-trees-part-1]]]
status: draft
---
# 이진 탐색 트리 (Binary Search Trees)

*(English: [Binary Search Trees](/portfolio/study/binary-search-tree/))*

> BST 성질(왼쪽<노드<오른쪽)을 유지하는 트리로, 순서 있는 집합 연산을 O(높이)에 지원한다.

## 개념
각 노드에 키가 있고, 왼쪽 서브트리의 모든 키는 더 작고 오른쪽은 더 크다. 검색·삽입·삭제·
최소/최대·후속이 모두 루트–잎 경로를 걸어 $O(h)$ ($h$ 는 트리 높이) 비용이다.

## 왜 중요한가
해시테이블과 달리 BST 는 키를 **순서대로** 유지해 범위 질의·후속·최소/최대에 답한다 — 단
높이가 작을 때만.

## 세부
중위 순회(in-order)는 정렬된 키를 낸다. 함정: 삽입으로 $h$ 가 $n$ 까지 커질 수 있어(퇴화한
"막대기") 연산이 $O(n)$ 이 된다. $h=O(\log n)$ 유지에는 **균형화(balancing)** 가 필요하다.

## 관련
[AVL 트리 (균형 이진 탐색 트리)](/portfolio/study/avl-tree.ko/) · [이진 힙과 우선순위 큐 (Binary Heaps, Priority Queues)](/portfolio/study/binary-heap.ko/) · [집합 대 수열 인터페이스 (Set vs Sequence Interfaces)](/portfolio/study/data-structure-interfaces.ko/)
