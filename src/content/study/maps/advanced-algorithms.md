---
type: map
title: Design and Analysis of Algorithms
summary: Topic map of 6.046J concepts — EN with KO pairs.
---

# 🗺️ Design and Analysis of Algorithms (6.046J)

> Atomic concept nodes from MIT 6.046J. Each links to its English note; every note has a Korean pair (`.ko`). Course: <span class="wl-missing" title="not published">6.046J</span>.


## Divide & Conquer

- [Linear-Time Selection (Median of Medians)](/portfolio/study/linear-time-selection/) · _Find the k-th smallest element in worst-case O(n) by choosing a provably good pivot via medians of groups._  (L1)
- [FFT & Polynomial Multiplication](/portfolio/study/fft-polynomial-multiplication/) · _Multiply degree-n polynomials in O(n log n) by evaluating at roots of unity and interpolating back._  (L5)

## Greedy

- [Greedy Algorithms & the Exchange Argument](/portfolio/study/greedy-algorithms/) · _Build a solution by locally optimal choices; prove optimality by an exchange argument or matroid structure._  (L2)
- [Interval Scheduling](/portfolio/study/interval-scheduling/) · _Select the most non-overlapping intervals by repeatedly taking the one that finishes earliest._  (L2)
- [Huffman Coding](/portfolio/study/huffman-coding/) · _Build an optimal prefix-free code greedily by repeatedly merging the two least-frequent symbols._  (L19)

## Graphs: MST & Flow

- [Minimum Spanning Trees](/portfolio/study/minimum-spanning-tree/) · _The cheapest set of edges connecting all vertices; greedy works thanks to the cut property._  (L3,4)
- [Prim's Algorithm](/portfolio/study/prims-algorithm/) · _Grow an MST from one vertex, repeatedly adding the cheapest edge leaving the current tree via a priority queue._  (L3)
- [Kruskal's Algorithm](/portfolio/study/kruskals-algorithm/) · _Sort all edges and add each lightest edge that joins two different components, using union-find._  (L4)
- [Union-Find (Disjoint Sets)](/portfolio/study/union-find/) · _Maintain disjoint sets with near-constant find/union via union-by-rank and path compression._  (L4,16)
- [Network Flow & Max-Flow Min-Cut](/portfolio/study/network-flow/) · _Push the most flow from source to sink; the maximum flow equals the minimum cut capacity._  (L13)

## All-Pairs Shortest Paths

- [All-Pairs Shortest Paths via DP](/portfolio/study/apsp-dynamic-programming/) · _Compute shortest paths between every pair by a DP over path length, like repeated matrix multiplication._  (L6)
- [Floyd–Warshall Algorithm](/portfolio/study/floyd-warshall/) · _All-pairs shortest paths in O(V^3) by a DP that allows intermediate vertices one at a time._  (L7)
- [Johnson's Algorithm](/portfolio/study/johnsons-algorithm/) · _All-pairs shortest paths on sparse graphs: reweight with Bellman-Ford to remove negatives, then run Dijkstra from each vertex._  (L7)

## Randomization

- [Randomized Algorithms](/portfolio/study/randomized-algorithms/) · _Use random choices for speed or simplicity; Las Vegas is always correct, Monte Carlo may err with small probability._  (L8,9)
- [Universal & Perfect Hashing](/portfolio/study/universal-hashing/) · _Pick a hash function at random from a universal family so no adversary can force many collisions._  (L10)
- [Derandomization](/portfolio/study/derandomization/) · _Convert a randomized algorithm into a deterministic one, e.g. by the method of conditional expectations._  (L22)

## Amortized & Online

- [Amortized Analysis](/portfolio/study/amortized-analysis/) · _Bound the average cost per operation over a worst-case sequence using aggregate, accounting, or potential methods._  (L10,11)
- [Competitive Analysis (Online Algorithms)](/portfolio/study/competitive-analysis/) · _Judge an online algorithm (no future knowledge) by its worst-case ratio to the optimal offline solution._  (L12)

## Advanced Data Structures

- [van Emde Boas Trees](/portfolio/study/van-emde-boas/) · _A recursive structure over a universe of size u giving predecessor/successor in O(log log u)._  (L15)

## Intractability & Approximation

- [NP-Completeness & Reductions](/portfolio/study/np-completeness/) · _A problem is NP-complete if it is in NP and every NP problem reduces to it; one polynomial solution would collapse P=NP._  (L17)
- [Approximation Algorithms](/portfolio/study/approximation-algorithms/) · _For NP-hard optimization, find a provably near-optimal solution in polynomial time with a guaranteed ratio._  (L18)

## Sublinear, Geometry & Clustering

- [Sublinear-Time Algorithms](/portfolio/study/sublinear-algorithms/) · _Answer approximately by reading only a tiny sample of a huge input, in time less than its size._  (L20)
- [Computational Geometry](/portfolio/study/computational-geometry/) · _Algorithms for geometric objects: sweep lines for intersections, convex hull, and closest pair._  (L23)
- [Clustering](/portfolio/study/clustering/) · _Partition points into groups by similarity; greedy and MST-based methods give approximation guarantees._  (L21)

---
*Korean entry point:* each concept's Korean note is `<slug>.ko`.
