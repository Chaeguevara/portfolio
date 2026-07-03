---
type: concept
title: Binary Search Trees
lang: en
pair: "[[binary-search-tree.ko]]"
course: "6.006"
lectures: [6]
summary: A tree keeping the BST property (left < node < right) supports ordered set operations in O(height).
tags: [data-structures, trees]
prereqs: [[[data-structure-interfaces]]]
related: [[[avl-tree]], [[binary-heap]]]
source: [[[L06-binary-trees-part-1]]]
status: draft
---
# Binary Search Trees

*(한국어: [이진 탐색 트리 (Binary Search Trees)](/portfolio/study/binary-search-tree.ko/))*

> A tree keeping the BST property (left < node < right) supports ordered set operations in O(height).

## Idea
Each node has a key; every key in its left subtree is smaller, every key in its right subtree
larger. Search, insert, delete, min/max, and successor all walk a root-to-leaf path, costing
$O(h)$ where $h$ is the tree height.

## Why it matters
Unlike a hash table, a BST keeps keys **ordered**, so it answers range queries, successor, and
min/max — but only if the height stays small.

## Details
Traversal in-order yields sorted keys. The catch: insertions can make $h$ as large as $n$
(a degenerate "stick"), making operations $O(n)$. Keeping $h=O(\log n)$ requires **balancing**.

## Related
[AVL Trees (Balanced BSTs)](/portfolio/study/avl-tree/) · [Binary Heaps & Priority Queues](/portfolio/study/binary-heap/) · [Set vs Sequence Interfaces](/portfolio/study/data-structure-interfaces/)
