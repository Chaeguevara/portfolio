---
type: concept
title: "Probability: Sample Spaces & the Four-Step Method"
lang: en
pair: "[[probability-basics.ko]]"
course: "6.042J"
lectures: [18]
summary: Model an experiment by a sample space and a probability on outcomes; the four-step method makes it systematic.
tags: [probability]
prereqs: [[[counting-principles]]]
related: [[[conditional-probability-and-bayes]], [[independence]], [[random-variables]]]
source: [[[L18-probability-introduction]]]
status: draft
---
Probability: Sample Spaces & the Four-Step Method

*(한국어: [확률 기초: 표본공간과 4단계 방법](/portfolio/study/probability-basics.ko/))*

> Model an experiment by a sample space and a probability on outcomes; the four-step method makes it systematic.

## Idea
A **sample space** $\Omega$ lists all outcomes; an **event** is a subset; a probability
assigns $\Pr[\omega]\ge 0$ summing to $1$, and $\Pr[E]=\sum_{\omega\in E}\Pr[\omega]$. The
**four-step method:** (1) find the sample space, (2) define events, (3) assign outcome
probabilities, (4) compute the event probability.

## Why it matters
Disciplined setup prevents the classic blunders. Monty Hall and the birthday problem look
paradoxical only until the sample space is written out.

## Details
For equally likely outcomes, $\Pr[E]=|E|/|\Omega|$ — so probability reduces to counting. A
tree diagram organizes multi-stage experiments and their outcome probabilities.

## Related
[Conditional Probability & Bayes' Theorem](/portfolio/study/conditional-probability-and-bayes/) · [Independence](/portfolio/study/independence/) · [Random Variables & Distributions](/portfolio/study/random-variables/)
