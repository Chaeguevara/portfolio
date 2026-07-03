---
type: concept
title: Dynamic Programming (SRTBOT)
lang: en
pair: "[[dynamic-programming.ko]]"
course: "6.006"
lectures: [15, 16, 17]
summary: Solve a problem via overlapping subproblems related by a recurrence, evaluated once each in topological order.
tags: [dynamic-programming]
prereqs: [[[dag-relaxation]]]
related: [[[pseudopolynomial]], [[divide-and-conquer-recurrences]]]
source: [[[L15-dynamic-programming-part-1-srtbot-fib-dags-bowling]], [[L16-dynamic-programming-part-2-lcs-lis-coins]], [[L17-dynamic-programming-part-3-apsp-parens-piano]]]
status: draft
---
# Dynamic Programming (SRTBOT)

*(한국어: [동적 계획법 (SRTBOT) (Dynamic Programming)](/portfolio/study/dynamic-programming.ko/))*

> Solve a problem via overlapping subproblems related by a recurrence, evaluated once each in topological order.

## Idea
Dynamic programming = recursion + memoization on **overlapping subproblems**. The 6.006
**SRTBOT** recipe: **S**ubproblems, **R**elate by a recurrence, **T**opological order (acyclic),
**B**ase cases, **O**riginal problem, **T**ime. Each subproblem is solved once and reused.

## Why it matters
Turns exponential brute force into polynomial time whenever subproblems repeat — the single
most powerful algorithm-design technique for optimization and counting.

## Details
Running time $=$ (number of subproblems) $\times$ (work per subproblem). Examples: Fibonacci,
longest common subsequence, longest increasing subsequence, edit distance, coin change. It is
DAG relaxation where the DAG is the subproblem-dependency graph.

## Diagram

```mermaid
flowchart TD
    S["SRTBOT framework"] --> SUB["Subproblems: define x(i)"]
    SUB --> REL["Relate: recurrence among subproblems"]
    REL --> TOP["Topological order: acyclic dependencies"]
    TOP --> BASE["Base cases"]
    BASE --> ORIG["Original problem from subproblems"]
    ORIG --> TIME["Time = #subproblems x work each"]
```

## Related
[Pseudopolynomial Time & Subset Sum](/portfolio/study/pseudopolynomial/) · [Divide-and-Conquer Recurrences & Master Theorem](/portfolio/study/divide-and-conquer-recurrences/) · [DAG Shortest Paths (Relaxation)](/portfolio/study/dag-relaxation/)
