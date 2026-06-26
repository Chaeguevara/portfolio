---
type: concept
title: Kempe's Universality Theorem
lang: en
pair: "[[kempe-universality-theorem.ko]]"
course: "6.849"
lectures: [10]
summary: There is a linkage whose tracing joint draws any given polynomial (algebraic) curve — 'a linkage to sign your name'.
tags: [linkages, theorem]
prereqs: [[[linkage]], [[configuration-space]]]
related: [[[linkage]], [[configuration-space]]]
source: [[[L10-kempe-s-universality-theorem]]]
status: draft
---
# Kempe's Universality Theorem

*(한국어: [켐프 보편성 정리 (Kempe's Universality Theorem)](/portfolio/study/kempe-universality-theorem.ko/))*

> There is a linkage whose tracing joint draws any given polynomial (algebraic) curve — 'a linkage to sign your name'.

## Statement
For **any** bounded piece of an algebraic curve in the plane, there is a linkage
with a distinguished joint that traces exactly that curve as the linkage moves.
Slogan: *there is a linkage to sign your name.* Any shape you can write is part of
some algebraic curve, so some linkage draws it.

## Why it matters
It is a foundational universality result for linkages — mechanisms are
astonishingly expressive. It also illustrates how to *compute with linkages*:
gadgets add and subtract angles, and multiply angles by constants.

## Proof ingredients (the "gadgets")
- **Adder / subtractor** gadgets combine two input angles into their sum/difference.
- **Multiplier** gadgets scale an angle by a constant.
- A **contraparallelogram** (a crossed linkage) is braced to enforce the needed
  angle relations.
Together they build a mechanism that realizes the polynomial defining the curve.

## History
Kempe's original 1876 proof had a bug (some configurations degenerate); later work
gave correct, generalized, and strengthened versions (and higher-dimensional ones).

## Related
[Linkage](/portfolio/study/linkage/) · [Configuration Space](/portfolio/study/configuration-space/)
