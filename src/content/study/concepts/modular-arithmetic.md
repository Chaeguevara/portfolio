---
type: concept
title: Modular Arithmetic
lang: en
pair: "[[modular-arithmetic.ko]]"
course: "6.042J"
lectures: [5]
summary: Arithmetic on remainders mod n; inverses exist when gcd with n is 1, and Fermat/Euler give fast exponentiation.
tags: [number-theory]
prereqs: [[[divisibility-and-gcd]]]
related: [[[rsa-cryptosystem]]]
source: [[[L05-number-theory-ii]]]
status: draft
---
# Modular Arithmetic

*(한국어: [모듈러 산술 (Modular Arithmetic)](/portfolio/study/modular-arithmetic.ko/))*

> Arithmetic on remainders mod n; inverses exist when gcd with n is 1, and Fermat/Euler give fast exponentiation.

## Idea
$a\equiv b\pmod n$ means $n\mid(a-b)$. Addition and multiplication respect congruence, so we
can compute with remainders. The inverse $a^{-1}$ exists iff $\gcd(a,n)=1$, found via
extended Euclid.

## Why it matters
The arithmetic of cryptography and hashing. **Fermat's little theorem**
$a^{p-1}\equiv 1\pmod p$ (for prime $p$) and **Euler's theorem**
$a^{\phi(n)}\equiv 1\pmod n$ let us reduce huge exponents.

## Details
**Fast exponentiation** (repeated squaring) computes $a^k\bmod n$ in $O(\log k)$
multiplications — essential since $k$ can be astronomically large in RSA.

## Related
[Divisibility, GCD & the Euclidean Algorithm](/portfolio/study/divisibility-and-gcd/) · [RSA Public-Key Cryptography](/portfolio/study/rsa-cryptosystem/)
