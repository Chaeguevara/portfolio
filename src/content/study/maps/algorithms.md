---
type: map
title: Algorithms
summary: Topic map of 6.006 concepts — EN with KO pairs.
---

# 🗺️ Algorithms (6.006)

> Atomic concept nodes from MIT 6.006. Each links to its English note; every note has a Korean pair (`.ko`). Course: <span class="wl-missing" title="not published">6.006</span>.


## Foundations & Models

- [Computational Problems & Algorithms](/portfolio/study/computational-problem/) · _A problem maps inputs to correct outputs; an algorithm is a procedure that solves every instance, proven correct by induction._  (L1)
- [Asymptotic Notation (Big-O)](/portfolio/study/asymptotic-notation/) · _O, Omega, Theta describe how running time grows with input size, hiding constants and lower-order terms._  (L1,19)
- [The Word-RAM Model](/portfolio/study/word-ram-model/) · _The cost model: memory is words of w bits, and basic operations on a word take O(1) time._  (L1,2)

## Data Structures

- [Set vs Sequence Interfaces](/portfolio/study/data-structure-interfaces/) · _Separate the operations a data structure must support (interface) from how it does so (implementation)._  (L2)
- [Dynamic Arrays](/portfolio/study/dynamic-array/) · _A resizable array that doubles capacity when full, giving O(1) amortized append with O(1) indexing._  (L2)
- [Hash Tables (Chaining)](/portfolio/study/hash-table/) · _Store keys in buckets chosen by a hash function; with a good hash, search/insert/delete are O(1) expected._  (L4)
- [Binary Search Trees](/portfolio/study/binary-search-tree/) · _A tree keeping the BST property (left < node < right) supports ordered set operations in O(height)._  (L6)
- [AVL Trees (Balanced BSTs)](/portfolio/study/avl-tree/) · _A self-balancing BST that keeps subtree heights within 1, guaranteeing O(log n) operations via rotations._  (L7)
- [Binary Heaps & Priority Queues](/portfolio/study/binary-heap/) · _An array-based near-complete tree with the heap property, giving O(log n) insert and extract-min/max._  (L8)

## Sorting

- [Comparison Sorting & Its Lower Bound](/portfolio/study/comparison-sorting/) · _Algorithms that order items only by comparing pairs need Omega(n log n) comparisons in the worst case._  (L3)
- [Merge Sort](/portfolio/study/merge-sort/) · _Divide the array in half, sort each recursively, and merge the sorted halves in linear time — O(n log n)._  (L3)
- [Linear-Time Sorting (Counting & Radix)](/portfolio/study/linear-sorting/) · _When keys are small integers, counting and radix sort order n items in O(n) by avoiding comparisons._  (L5)

## Graphs & Search

- [Graph Representations](/portfolio/study/graph-representation/) · _Store a graph as adjacency lists (sparse-friendly) or an adjacency matrix (dense, O(1) edge test)._  (L9)
- [Breadth-First Search (BFS)](/portfolio/study/breadth-first-search/) · _Explore a graph in layers from a source, computing shortest paths by edge count in O(V+E)._  (L9)
- [Depth-First Search (DFS)](/portfolio/study/depth-first-search/) · _Explore as deep as possible before backtracking; classifies edges and exposes graph structure in O(V+E)._  (L10)
- [Topological Sort](/portfolio/study/topological-sort/) · _Linearly order a DAG so every edge points forward; the prerequisite of DAG dynamic programming._  (L10)

## Shortest Paths

- [Weighted Shortest Paths: Overview](/portfolio/study/weighted-shortest-paths/) · _Find minimum-weight paths from a source; the right algorithm depends on edge signs and graph shape._  (L11)
- [DAG Shortest Paths (Relaxation)](/portfolio/study/dag-relaxation/) · _On a DAG, relaxing edges in topological order gives shortest paths in O(V+E), even with negative weights._  (L11)
- [Bellman–Ford Algorithm](/portfolio/study/bellman-ford/) · _Relax all edges V-1 times to find shortest paths with negative weights, and detect negative cycles._  (L12)
- [Dijkstra's Algorithm](/portfolio/study/dijkstra/) · _Greedily settle the nearest unsettled vertex using a priority queue; O(E + V log V) for nonnegative weights._  (L13)

## Dynamic Programming

- [Dynamic Programming (SRTBOT)](/portfolio/study/dynamic-programming/) · _Solve a problem via overlapping subproblems related by a recurrence, evaluated once each in topological order._  (L15,16,17)
- [Pseudopolynomial Time & Subset Sum](/portfolio/study/pseudopolynomial/) · _A DP whose time depends on a numeric value (not just input length) runs in pseudopolynomial time — e.g. subset sum and knapsack._  (L18)

## Complexity

- [Complexity Classes: P, NP, EXP](/portfolio/study/complexity-classes/) · _Classify problems by the resources to solve or verify them; P is efficiently solvable, NP efficiently verifiable._  (L19)

---
*Korean entry point:* each concept's Korean note is `<slug>.ko`.
