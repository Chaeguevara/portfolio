---
type: concept
title: Competitive Analysis (Online Algorithms)
lang: en
pair: "[[competitive-analysis.ko]]"
course: "6.046J"
lectures: [12]
summary: Judge an online algorithm (no future knowledge) by its worst-case ratio to the optimal offline solution.
tags: [analysis, online]
prereqs: [[[amortized-analysis]]]
related: [[[amortized-analysis]]]
source: [[[L12-competitive-analysis]]]
status: draft
---
# Competitive Analysis (Online Algorithms)

*(한국어: [경쟁 분석 (온라인 알고리즘) (Competitive Analysis)](/portfolio/study/competitive-analysis.ko/))*

> Judge an online algorithm (no future knowledge) by its worst-case ratio to the optimal offline solution.

## Idea
An **online** algorithm must decide as inputs arrive, without seeing the future. It is
**$c$-competitive** if its cost is at most $c$ times the best *offline* cost (which knows the
whole input) on every sequence.

## Why it matters
The right yardstick when decisions can't wait — caching, paging, load balancing, and
buy-vs-rent problems — where worst-case-vs-optimal is the honest comparison.

## Details
**Ski rental:** rent for \$1/day or buy for \$B; renting until day $B$ then buying is
$2$-competitive. **Move-to-front** for self-organizing lists is $2$-competitive. Lower bounds
show some ratio is unavoidable; randomization can improve it.

## Related
[Amortized Analysis](/portfolio/study/amortized-analysis/)
