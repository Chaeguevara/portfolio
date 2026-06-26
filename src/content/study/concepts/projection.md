---
type: concept
title: Projection onto a Subspace
lang: en
pair: "[[projection.ko]]"
course: "18.06"
lectures: [15]
summary: The closest point in a subspace to b; given by the projection matrix P = A(A^TA)^{-1}A^T.
tags: [orthogonality]
prereqs: [[[orthogonality]]]
related: [[[least-squares]], [[orthogonality]], [[orthogonal-matrix]]]
source: [[[L15-projections-onto-subspaces]]]
status: draft
---
# Projection onto a Subspace

*(한국어: [부분공간으로의 사영 (Projection)](/portfolio/study/projection.ko/))*

> The closest point in a subspace to b; given by the projection matrix P = A(A^TA)^{-1}A^T.

## Idea
The **projection** of $b$ onto a subspace is the closest point in it to $b$; the error
$b-p$ is orthogonal to the subspace. Onto the column space of $A$ (independent columns):
$$
P = A(A^TA)^{-1}A^T,\qquad p = Pb.
$$

## Why it matters
Projection is the geometric engine of [Least Squares](/portfolio/study/least-squares/): when $Ax=b$ has no solution, solve
for the projection $p$ instead. It also explains Fourier series and orthonormal expansions
(project onto each basis direction).

## Details
- $P$ is **symmetric** and **idempotent**: $P^T=P$, $P^2=P$.
- Projecting onto a line through $a$: $P=\dfrac{aa^T}{a^Ta}$.
- $I-P$ projects onto the orthogonal complement.

## Diagram

```mermaid
flowchart TD
    B["vector b"] --> PR["project onto C(A)"]
    PR --> P["p = closest point in the subspace"]
    B --> E["error e = b - p"]
    E -. "orthogonal to the subspace" .- P
```

## Related
[Least Squares](/portfolio/study/least-squares/) · [Orthogonality & Orthogonal Complements](/portfolio/study/orthogonality/) · [Gram–Schmidt Orthogonalization](/portfolio/study/gram-schmidt/)
