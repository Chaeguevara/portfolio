---
type: concept
title: AVL 트리 (균형 이진 탐색 트리)
lang: ko
pair: "[[avl-tree]]"
course: "6.006"
lectures: [7]
summary: 서브트리 높이 차를 1 이내로 유지하는 자가균형 BST로, 회전을 통해 O(log n) 연산을 보장한다.
tags: [data-structures, trees]
prereqs: [[[binary-search-tree.ko]]]
related: [[[binary-search-tree.ko]]]
source: [[[L07-binary-trees-part-2-avl]]]
status: draft
---
# AVL 트리 (균형 이진 탐색 트리)

*(English: [AVL Trees (Balanced BSTs)](/portfolio/study/avl-tree/))*

> 서브트리 높이 차를 1 이내로 유지하는 자가균형 BST로, 회전을 통해 O(log n) 연산을 보장한다.

## 개념
**AVL 트리** 는 모든 노드의 두 서브트리 높이 차가 많아야 $1$ 인 BST 다. 이 불변량이
$h=O(\log n)$ 을 강제한다. 삽입/삭제로 균형이 깨지면 **회전(rotation)**(국소 $O(1)$ 재구성)으로
복원한다.

## 왜 중요한가
BST 의 순서 연산을 *최악* $O(\log n)$ 보장으로 제공한다 — 검색·삽입·삭제·후속·범위 — 신뢰할
수 있는 순서 집합/사전이 된다.

## 세부
각 노드는 높이(또는 균형 인자)를 저장한다. 삽입은 한두 번, 삭제는 경로를 따라 $O(\log n)$
회전이 필요할 수 있다. 다른 균형 BST(레드-블랙, 2-3, B-트리)는 같은 한계를 다르게 달성한다.

## 관련
[이진 탐색 트리 (Binary Search Trees)](/portfolio/study/binary-search-tree.ko/) · [이진 힙과 우선순위 큐 (Binary Heaps, Priority Queues)](/portfolio/study/binary-heap.ko/)
