---
type: concept
title: Propositions, Predicates & Quantifiers
lang: en
pair: "[[propositions-and-logic.ko]]"
course: "6.042J"
lectures: [1]
summary: A proposition is a statement that is true or false; predicates add variables, and quantifiers (for-all, exists) bind them.
tags: [logic, proofs]
prereqs: []
related: [[[proof-methods]], [[induction]]]
source: [[[L01-introduction-and-proofs]]]
status: draft
---
# Propositions, Predicates & Quantifiers

*(한국어: [명제·술어·한정사 (Propositions, Predicates, Quantifiers)](/portfolio/study/propositions-and-logic.ko/))*

> A proposition is a statement that is true or false; predicates add variables, and quantifiers (for-all, exists) bind them.

## Idea
A **proposition** has a definite truth value. Combine them with $\land$ (and), $\lor$ (or),
$\lnot$ (not), $\Rightarrow$ (implies). An **implication** $P\Rightarrow Q$ is false only when
$P$ is true and $Q$ is false. A **predicate** like $P(x)$ becomes a proposition once $x$ is
fixed; **quantifiers** turn it back into one statement: $\forall x\,P(x)$, $\exists x\,P(x)$.

## Why it matters
This is the language every proof is written in. Negating quantifiers correctly —
$\lnot\forall x\,P(x)\equiv\exists x\,\lnot P(x)$ — is the move behind contradiction and
counterexample arguments.

## Details
Key equivalences: contrapositive $P\Rightarrow Q\equiv\lnot Q\Rightarrow\lnot P$; De Morgan
$\lnot(P\land Q)\equiv\lnot P\lor\lnot Q$. Order of quantifiers matters:
$\forall x\,\exists y$ differs from $\exists y\,\forall x$.

## Related
[Proof Methods](/portfolio/study/proof-methods/) · [Mathematical Induction](/portfolio/study/induction/)
