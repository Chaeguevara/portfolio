---
type: concept
title: Gram–Schmidt Orthogonalization
lang: en
pair: "[[gram-schmidt.ko]]"
course: "18.06"
lectures: [17]
summary: Turn any independent set into an orthonormal one by subtracting projections, one vector at a time.
tags: [orthogonality, algorithms]
prereqs: [[[projection]]]
related: [[[qr-factorization]], [[orthogonal-matrix]], [[projection]]]
source: [[[L17-orthogonal-matrices-and-gram-schmidt]]]
status: draft
---
# Gram–Schmidt Orthogonalization

*(한국어: [그람–슈미트 직교화 (Gram–Schmidt)](/portfolio/study/gram-schmidt.ko/))*

> Turn any independent set into an orthonormal one by subtracting projections, one vector at a time.

## Idea
Given independent $a_1,\dots,a_n$, build orthonormal $q_1,\dots,q_n$: take each $a_k$,
**subtract its projections** onto the already-chosen $q$'s, then normalize.
$$
q_k = \frac{a_k - \sum_{j<k}(q_j^Ta_k)q_j}{\| \cdot \|}.
$$

## Why it matters
Orthonormal bases make everything easy: projections become dot products, no matrix inverse
needed. Gram–Schmidt is the construction behind the [QR Factorization](/portfolio/study/qr-factorization/) $A=QR$.

## Details
- The $q$'s span the same space as the $a$'s at every step.
- The coefficients $q_j^Ta_k$ become the upper-triangular $R$.
- Numerically, "modified" Gram–Schmidt is more stable than the classic version.

## Diagram

```mermaid
flowchart LR
    A["independent vectors a1..an"] --> G["subtract projections onto chosen q's"]
    G --> N["normalize"]
    N --> Q["orthonormal q1..qn"]
    Q --> QR["gives A = Q R"]
```

## Related
[QR Factorization](/portfolio/study/qr-factorization/) · [Orthogonal Matrix](/portfolio/study/orthogonal-matrix/) · [Projection onto a Subspace](/portfolio/study/projection/)
