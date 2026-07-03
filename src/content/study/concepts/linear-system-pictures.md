---
type: concept
title: Three Pictures of Ax = b
lang: en
pair: "[[linear-system-pictures.ko]]"
course: "18.06"
lectures: [1]
summary: "A linear system has three views: rows (intersecting planes), columns (combination of column vectors), and the matrix form Ax=b."
tags: [foundations]
prereqs: []
related: [[[gaussian-elimination]], [[column-space]], [[matrix-multiplication]]]
source: [[[L01-the-geometry-of-linear-equations]]]
status: draft
---
Three Pictures of Ax = b

*(한국어: [Ax = b 의 세 가지 그림 (Row/Column/Matrix Pictures)](/portfolio/study/linear-system-pictures.ko/))*

> A linear system has three views: rows (intersecting planes), columns (combination of column vectors), and the matrix form Ax=b.

## Idea
The same system $Ax=b$ can be read three ways:
- **Row picture** — each equation is a line/plane; the solution is where they intersect.
- **Column picture** — $b$ as a **linear combination of the columns** of $A$:
$$
x_1\,(\text{col}_1) + x_2\,(\text{col}_2) + \dots = b
$$
- **Matrix picture** — package it as $Ax = b$.

## Why it matters
The column picture is the one Strang stresses: solving $Ax=b$ asks *"which combination of
$A$'s columns gives $b$?"* This reframing leads directly to the [Column Space C(A)](/portfolio/study/column-space/) and the
whole subspace theory. A solution exists exactly when $b$ lies in the column space.

## Details
For 2 equations in 2 unknowns the row picture is two lines meeting at a point; the column
picture is two vectors combined to reach $b$. In higher dimensions rows become hyperplanes,
but the column view scales cleanly to $n$ dimensions.

## Diagram

```mermaid
flowchart TD
    S["System Ax = b"] --> R["Row picture: planes meet at a point"]
    S --> C["Column picture: combine columns of A to reach b"]
    S --> M["Matrix picture: A times x = b"]
    C --> K["Solvable exactly when b is in the column space"]
```

## Related
[Column Space C(A)](/portfolio/study/column-space/) · [Gaussian Elimination](/portfolio/study/gaussian-elimination/) · [Matrix Multiplication](/portfolio/study/matrix-multiplication/)
