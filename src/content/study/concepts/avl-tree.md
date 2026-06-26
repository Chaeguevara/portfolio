---
type: concept
title: AVL Trees (Balanced BSTs)
lang: en
pair: "[[avl-tree.ko]]"
course: "6.006"
lectures: [7]
summary: A self-balancing BST that keeps subtree heights within 1, guaranteeing O(log n) operations via rotations.
tags: [data-structures, trees]
prereqs: [[[binary-search-tree]]]
related: [[[binary-search-tree]]]
source: [[[L07-binary-trees-part-2-avl]]]
status: draft
---
# AVL Trees (Balanced BSTs)

*(한국어: [AVL 트리 (균형 이진 탐색 트리)](/portfolio/study/avl-tree.ko/))*

> A self-balancing BST that keeps subtree heights within 1, guaranteeing O(log n) operations via rotations.

## Idea
An **AVL tree** is a BST where every node's two subtrees differ in height by at most $1$. This
invariant forces $h=O(\log n)$. After an insert or delete breaks the balance, **rotations**
(local $O(1)$ restructurings) restore it.

## Why it matters
Gives the BST's ordered operations with a *worst-case* $O(\log n)$ guarantee — search, insert,
delete, successor, range — making it the reliable ordered set/dictionary.

## Details
Each node stores its height (or balance factor). An insertion may need one or two rotations;
a deletion may need $O(\log n)$ rotations up the path. Other balanced BSTs (red-black, 2-3,
B-trees) achieve the same bound differently.

## Related
[Binary Search Trees](/portfolio/study/binary-search-tree/) · [Binary Heaps & Priority Queues](/portfolio/study/binary-heap/)
