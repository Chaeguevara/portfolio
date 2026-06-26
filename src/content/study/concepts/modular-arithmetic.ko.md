---
type: concept
title: 모듈러 산술 (Modular Arithmetic)
lang: ko
pair: "[[modular-arithmetic]]"
course: "6.042J"
lectures: [5]
summary: 법 n 나머지 위의 산술; n과 서로소일 때 역원이 존재하고, 페르마/오일러로 빠른 거듭제곱을 한다.
tags: [number-theory]
prereqs: [[[divisibility-and-gcd.ko]]]
related: [[[rsa-cryptosystem.ko]]]
source: [[[L05-number-theory-ii]]]
status: draft
---
# 모듈러 산술 (Modular Arithmetic)

*(English: [Modular Arithmetic](/portfolio/study/modular-arithmetic/))*

> 법 n 나머지 위의 산술; n과 서로소일 때 역원이 존재하고, 페르마/오일러로 빠른 거듭제곱을 한다.

## 개념
$a\equiv b\pmod n$ 은 $n\mid(a-b)$ 라는 뜻. 덧셈·곱셈이 합동을 보존하므로 나머지로 계산할
수 있다. 역원 $a^{-1}$ 은 $\gcd(a,n)=1$ 일 때만 존재하며 확장 유클리드로 구한다.

## 왜 중요한가
암호와 해싱의 산술이다. **페르마 소정리** $a^{p-1}\equiv 1\pmod p$ ($p$ 소수)와
**오일러 정리** $a^{\phi(n)}\equiv 1\pmod n$ 로 거대한 지수를 줄인다.

## 세부
**빠른 거듭제곱(반복 제곱)** 은 $a^k\bmod n$ 을 $O(\log k)$ 번 곱셈으로 계산한다 — RSA 에서
$k$ 가 천문학적으로 클 수 있어 필수다.

## 관련
[나누어떨어짐·최대공약수·유클리드 호제법](/portfolio/study/divisibility-and-gcd.ko/) · [RSA 공개키 암호 (RSA Public-Key Cryptography)](/portfolio/study/rsa-cryptosystem.ko/)
