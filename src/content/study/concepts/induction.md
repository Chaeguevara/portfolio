---
type: concept
title: Mathematical Induction
lang: en
pair: "[[induction.ko]]"
course: "6.042J"
lectures: [2]
summary: Prove P(n) for all n by establishing a base case and that P(n) implies P(n+1).
tags: [proofs, induction]
prereqs: [[[proof-methods]]]
related: [[[strong-induction]], [[well-ordering-principle]], [[linear-recurrences]]]
source: [[[L02-induction]]]
status: draft
---
# Mathematical Induction

*(한국어: [수학적 귀납법 (Mathematical Induction)](/portfolio/study/induction.ko/))*

> Prove P(n) for all n by establishing a base case and that P(n) implies P(n+1).

## Idea
To prove $\forall n\ge 0\;P(n)$:
1. **Base case:** show $P(0)$.
2. **Inductive step:** assume $P(n)$ (the *inductive hypothesis*) and prove $P(n+1)$.
The domino effect then gives $P(n)$ for every $n$.

## Why it matters
The workhorse for statements about all naturals: closed forms for sums, correctness of
recursive algorithms, properties of recursively-defined objects.

## Details
Classic example: $\sum_{k=1}^{n} k = \tfrac{n(n+1)}{2}$. Base $n=1$ holds; the step adds
$n+1$ to both sides. Pitfalls: a missing base case, or a step that secretly assumes the
goal. **Structural induction** generalizes this to recursively-defined data.

## Diagram

```mermaid
flowchart LR
    B["Base case: P(0) true"] --> S["Inductive step: P(n) implies P(n+1)"]
    S --> C["Conclusion: P(n) for all n >= 0"]
```

## Related
[Strong Induction](/portfolio/study/strong-induction/) · [Well-Ordering Principle](/portfolio/study/well-ordering-principle/) · [Linear Recurrences](/portfolio/study/linear-recurrences/)
