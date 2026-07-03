---
type: concept
title: Rank
lang: en
pair: "[[rank.ko]]"
course: "18.06"
lectures: [7, 8, 9]
summary: The number of pivots = dimension of the column space = number of independent rows/columns; it governs solvability.
tags: [subspaces]
prereqs: [[[column-space]], [[nullspace]]]
related: [[[independence-basis-dimension]], [[four-fundamental-subspaces]], [[rank-one-matrix]]]
source: [[[L07-solving-ax-0-pivot-variables-special-solutions]], [[L08-solving-ax-b-row-reduced-form-r]], [[L09-independence-basis-and-dimension]]]
status: draft
---
# Rank

*(한국어: [랭크 (Rank)](/portfolio/study/rank.ko/))*

> The number of pivots = dimension of the column space = number of independent rows/columns; it governs solvability.

## Idea
The **rank** $r$ of $A$ is the number of pivots after elimination — equivalently
$\dim C(A) = \dim C(A^T)$ (row rank = column rank). It is the single number that decides
the shape of the solution set.

## Why it matters
The **rank–nullity theorem**: for an $m\times n$ matrix,
$$
\operatorname{rank}(A) + \dim N(A) = n.
$$
**Full rank** means: full column rank ($r=n$, unique solutions / independent columns) or
full row rank ($r=m$, always solvable). Square full-rank = invertible.

## Details
- The four subspace dimensions are $r,\,n-r,\,r,\,m-r$
  ([The Four Fundamental Subspaces](/portfolio/study/four-fundamental-subspaces/)).
- A [Rank-One Matrices](/portfolio/study/rank-one-matrix/) ($r=1$) is $uv^T$; any matrix is a sum of $r$ rank-one pieces.

## Diagram

```mermaid
flowchart LR
    R["rank r"] --> P["pivots = r"]
    R --> CS["dim column space = r"]
    R --> RS["dim row space = r"]
    R --> N["dim nullspace = n - r"]
    P --> RN["rank + nullity = n"]
    N --> RN
```

## Related
[The Four Fundamental Subspaces](/portfolio/study/four-fundamental-subspaces/) · [Independence, Basis, Dimension](/portfolio/study/independence-basis-dimension/) · [Complete Solution of Ax = b](/portfolio/study/complete-solution-ax-b/)
