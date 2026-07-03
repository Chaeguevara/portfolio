---
type: concept
title: Randomized Algorithms
lang: en
pair: "[[randomized-algorithms.ko]]"
course: "6.046J"
lectures: [8, 9]
summary: Use random choices for speed or simplicity; Las Vegas is always correct, Monte Carlo may err with small probability.
tags: [randomization]
prereqs: []
related: [[[universal-hashing]], [[derandomization]], [[linear-time-selection]]]
source: [[[L08-randomized-algorithms-i]], [[L09-randomized-algorithms-ii]]]
status: draft
---
# Randomized Algorithms

*(한국어: [무작위 알고리즘 (Randomized Algorithms)](/portfolio/study/randomized-algorithms.ko/))*

> Use random choices for speed or simplicity; Las Vegas is always correct, Monte Carlo may err with small probability.

## Idea
A **randomized algorithm** flips coins during execution. **Las Vegas:** always returns the
correct answer, with running time random (e.g. randomized quicksort/quickselect). **Monte
Carlo:** fixed running time but a bounded probability of a wrong answer.

## Why it matters
Often simpler and faster than the best deterministic algorithm, and sometimes the only
practical approach — randomness defeats adversarial worst-case inputs.

## Details
Analyze via **expected** running time (linearity of expectation) or error probability.
**Freivalds' algorithm** checks a matrix product $AB=C$ in $O(n^2)$ with one random vector,
erring with probability $\le 1/2$ — repeat $k$ times to push error to $2^{-k}$.

## Diagram

```mermaid
flowchart TD
    R["use randomness"] --> LV["Las Vegas: always correct, expected fast"]
    R --> MC["Monte Carlo: fast, small error probability"]
    MC --> AMP["repeat to drive error down"]
```

## Related
[Universal & Perfect Hashing](/portfolio/study/universal-hashing/) · [Derandomization](/portfolio/study/derandomization/) · [Linear-Time Selection (Median of Medians)](/portfolio/study/linear-time-selection/)
