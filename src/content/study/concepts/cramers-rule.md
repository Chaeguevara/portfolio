---
type: concept
title: Cramer's Rule & Volume
lang: en
pair: "[[cramers-rule.ko]]"
course: "18.06"
lectures: [20]
summary: Solve Ax=b by ratios of determinants; det also measures volume scaling of the map A.
tags: [determinants]
prereqs: [[[determinant]], [[cofactor-expansion]]]
related: [[[determinant]], [[matrix-inverse]]]
source: [[[L20-cramer-s-rule-inverse-matrix-and-volume]]]
status: draft
---
# Cramer's Rule & Volume

*(한국어: [크라메르 공식과 부피 (Cramer's Rule)](/portfolio/study/cramers-rule.ko/))*

> Solve Ax=b by ratios of determinants; det also measures volume scaling of the map A.

## Idea
**Cramer's rule:** for invertible $A$,
$$
x_i = \frac{\det B_i}{\det A},
$$
where $B_i$ is $A$ with column $i$ replaced by $b$. Also, $|\det A|$ is the **volume** of
the parallelepiped spanned by $A$'s columns; $A$ scales every volume by $|\det A|$.

## Why it matters
It ties the determinant to solving systems and to geometry (volume, orientation via sign).
Elegant and theoretically important — but, like the cofactor inverse, **impractical** for
large systems (use elimination).

## Details
- Orientation: $\det A>0$ preserves, $<0$ flips orientation.
- $\det = 0$ ⇒ columns are flat (zero volume) ⇒ singular.

## Related
[Determinant](/portfolio/study/determinant/) · [Cofactor Expansion](/portfolio/study/cofactor-expansion/) · [Matrix Inverse](/portfolio/study/matrix-inverse/)
