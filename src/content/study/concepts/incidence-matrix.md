---
type: concept
title: Incidence Matrices (Graphs & Networks)
lang: en
pair: "[[incidence-matrix.ko]]"
course: "18.06"
lectures: [12]
summary: A matrix encoding a graph (edges×nodes); its four subspaces are loops, potentials, and Kirchhoff's laws.
tags: [subspaces, applications]
prereqs: [[[four-fundamental-subspaces]]]
related: [[[four-fundamental-subspaces]], [[nullspace]]]
source: [[[L12-graphs-networks-incidence-matrices]]]
status: draft
---
# Incidence Matrices (Graphs & Networks)

*(한국어: [접속 행렬 (Incidence Matrix, 그래프·회로망)](/portfolio/study/incidence-matrix.ko/))*

> A matrix encoding a graph (edges×nodes); its four subspaces are loops, potentials, and Kirchhoff's laws.

## Idea
An **incidence matrix** $A$ has one row per edge and one column per node: each edge row has
$-1$ at its start node and $+1$ at its end. $Ax$ measures **potential differences** across
edges.

## Why it matters
It is the cleanest application of the [The Four Fundamental Subspaces](/portfolio/study/four-fundamental-subspaces/):
- $N(A)$ = constant potentials (the all-ones vector) ⇒ $\dim=1$ for a connected graph.
- $N(A^T)$ = independent **loops** (Kirchhoff's current law).
- $C(A^T)$ relates to spanning trees; $\operatorname{rank} = \#\text{nodes} - 1$.
- Euler's formula (nodes $-$ edges $+$ loops $=1$) falls out of these dimensions.

## Related
[The Four Fundamental Subspaces](/portfolio/study/four-fundamental-subspaces/) · [Nullspace N(A)](/portfolio/study/nullspace/)
