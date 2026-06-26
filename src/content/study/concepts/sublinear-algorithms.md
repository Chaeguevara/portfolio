---
type: concept
title: Sublinear-Time Algorithms
lang: en
pair: "[[sublinear-algorithms.ko]]"
course: "6.046J"
lectures: [20]
summary: Answer approximately by reading only a tiny sample of a huge input, in time less than its size.
tags: [sublinear]
prereqs: [[[randomized-algorithms]]]
related: [[[randomized-algorithms]]]
source: [[[L20-sublinear-time-algorithms]]]
status: draft
---
# Sublinear-Time Algorithms

*(한국어: [준선형 시간 알고리즘 (Sublinear-Time Algorithms)](/portfolio/study/sublinear-algorithms.ko/))*

> Answer approximately by reading only a tiny sample of a huge input, in time less than its size.

## Idea
For massive inputs, even reading everything is too slow. A **sublinear** algorithm samples a
small random part and returns an approximate or probabilistic answer in $o(n)$ time —
necessarily approximate, since it never sees most of the input.

## Why it matters
Essential at big-data scale (databases, networks, streams) where $O(n)$ is unaffordable; the
realistic model when the input is enormous or arrives as a stream.

## Details
**Property testing:** distinguish "has property $P$" from "far from any object with $P$" by
sampling — e.g. testing if a list is sorted, or a graph is bipartite. Also estimates of
average, diameter, and number of connected components from samples.

## Related
[Randomized Algorithms](/portfolio/study/randomized-algorithms/)
