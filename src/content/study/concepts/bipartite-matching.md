---
type: concept
title: Bipartite Matching & Hall's Theorem
lang: en
pair: "[[bipartite-matching.ko]]"
course: "6.042J"
lectures: [7]
summary: A matching pairs up vertices with no shared endpoints; Hall's condition tells exactly when one side can be fully matched.
tags: [graph-theory, matching]
prereqs: [[[graphs-basics]]]
related: [[[network-flow]], [[graph-coloring]]]
source: [[[L07-matching-problems]]]
status: draft
---
# Bipartite Matching & Hall's Theorem

*(한국어: [이분 매칭과 홀의 정리 (Bipartite Matching, Hall's Theorem)](/portfolio/study/bipartite-matching.ko/))*

> A matching pairs up vertices with no shared endpoints; Hall's condition tells exactly when one side can be fully matched.

## Idea
In a bipartite graph $L\cup R$, a **matching** is a set of edges with no shared vertex. A
matching **saturates** $L$ if every left vertex is matched. **Hall's theorem:** this is
possible iff for every $S\subseteq L$, $|N(S)|\ge|S|$ (the neighborhood is big enough).

## Why it matters
The model for assignment problems: jobs to workers, students to projects, the stable-marriage
setting. Hall's condition is the clean yes/no test.

## Details
Failing Hall's condition means some set of left vertices shares too few neighbors — a
"bottleneck" obstruction. Matchings are found via augmenting paths, the bipartite special
case of max-flow.

## Diagram

```mermaid
flowchart TD
    H["Hall's condition"] --> Q["every set S of left vertices has |N(S)| >= |S|"]
    Q -->|"holds"| M["perfect matching of the left side exists"]
    Q -->|"fails"| N["no matching saturates the left side"]
```

## Related
[Network Flow & Max-Flow Min-Cut](/portfolio/study/network-flow/) · [Graphs: Walks, Paths & Connectivity](/portfolio/study/graphs-basics/) · [Graph Coloring](/portfolio/study/graph-coloring/)
