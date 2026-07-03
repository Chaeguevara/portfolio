---
type: concept
title: Clustering
lang: en
pair: "[[clustering.ko]]"
course: "6.046J"
lectures: [21]
summary: Partition points into groups by similarity; greedy and MST-based methods give approximation guarantees.
tags: [geometry, approximation]
prereqs: [[[minimum-spanning-tree]]]
related: [[[minimum-spanning-tree]], [[approximation-algorithms]]]
source: [[[L21-clustering]]]
status: draft
---
# Clustering

*(한국어: [클러스터링 (Clustering)](/portfolio/study/clustering.ko/))*

> Partition points into groups by similarity; greedy and MST-based methods give approximation guarantees.

## Idea
**Clustering** groups $n$ points into $k$ clusters so that similar points share a cluster.
Objectives differ: **$k$-center** minimizes the largest cluster radius; **max-spacing**
maximizes the smallest inter-cluster distance.

## Why it matters
A core unsupervised primitive — data analysis, vision, bioinformatics — and a clean place to
apply greedy/approximation theory, since exact optima are NP-hard.

## Details
**Farthest-first** greedy gives a $2$-approximation for $k$-center. **Max-spacing $k$-clustering
$=$ MST minus the $k-1$ heaviest edges** (single-linkage), which is exactly optimal — a direct
payoff from the MST cut/cycle structure.

## Related
[Minimum Spanning Trees](/portfolio/study/minimum-spanning-tree/) · [Approximation Algorithms](/portfolio/study/approximation-algorithms/)
