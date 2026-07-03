---
type: concept
title: Generating Functions
lang: en
pair: "[[generating-functions.ko]]"
course: "6.042J"
lectures: [17]
summary: Encode a sequence as the coefficients of a power series; algebra on the series solves counting and recurrences.
tags: [counting, recurrences]
prereqs: [[[counting-principles]]]
related: [[[binomial-coefficients]], [[linear-recurrences]]]
source: [[[L17-counting-rules-ii]]]
status: draft
---
# Generating Functions

*(한국어: [생성함수 (Generating Functions)](/portfolio/study/generating-functions.ko/))*

> Encode a sequence as the coefficients of a power series; algebra on the series solves counting and recurrences.

## Idea
A sequence $a_0,a_1,\dots$ becomes $G(x)=\sum_n a_n x^n$. Operations on sequences map to
operations on $G$: shifting, convolution (multiplying series = combining choices), scaling.

## Why it matters
Turns recurrences and counting-with-constraints into algebra: solve for $G(x)$ in closed
form, then read off $a_n$ as a coefficient.

## Details
Key series: $\tfrac{1}{1-x}=\sum x^n$; $\tfrac{1}{(1-x)^2}=\sum (n+1)x^n$;
$(1+x)^n=\sum\binom nk x^k$. Solving the Fibonacci recurrence via $G(x)=\tfrac{x}{1-x-x^2}$
recovers the closed form by partial fractions.

## Related
[Binomial Coefficients & Pascal's Triangle](/portfolio/study/binomial-coefficients/) · [Linear Recurrences](/portfolio/study/linear-recurrences/) · [Counting: Sum, Product & Bijections](/portfolio/study/counting-principles/)
