---
type: concept
title: Proof Methods
lang: en
pair: "[[proof-methods.ko]]"
course: "6.042J"
lectures: [1]
summary: "Standard ways to prove a statement: direct, by cases, by contrapositive, and by contradiction."
tags: [proofs]
prereqs: [[[propositions-and-logic]]]
related: [[[induction]], [[well-ordering-principle]]]
source: [[[L01-introduction-and-proofs]]]
status: draft
---
Proof Methods

*(한국어: [증명 방법 (Proof Methods)](/portfolio/study/proof-methods.ko/))*

> Standard ways to prove a statement: direct, by cases, by contrapositive, and by contradiction.

## Idea
- **Direct:** assume the hypotheses, chain implications to the conclusion.
- **By cases:** split the universe into exhaustive cases and prove each.
- **Contrapositive:** prove $\lnot Q\Rightarrow\lnot P$ instead of $P\Rightarrow Q$.
- **Contradiction:** assume the negation, derive an impossibility.

## Why it matters
Picking the right method is half the battle. "$\sqrt 2$ is irrational" wants contradiction;
"if $n^2$ is even then $n$ is even" wants the contrapositive.

## Details
A valid proof needs every step to follow by a rule of inference from axioms or earlier
steps. Beware false proofs: dividing by a possibly-zero quantity, or assuming what you set
out to prove.

## Related
[Propositions, Predicates & Quantifiers](/portfolio/study/propositions-and-logic/) · [Mathematical Induction](/portfolio/study/induction/) · [Well-Ordering Principle](/portfolio/study/well-ordering-principle/)
