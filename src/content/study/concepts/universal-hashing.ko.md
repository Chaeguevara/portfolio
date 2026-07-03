---
type: concept
title: 유니버설·완전 해싱 (Universal & Perfect Hashing)
lang: ko
pair: "[[universal-hashing]]"
course: "6.046J"
lectures: [10]
summary: 유니버설 함수족에서 해시를 무작위로 골라 어떤 적도 충돌을 많이 강제하지 못하게 한다.
tags: [randomization, hashing]
prereqs: [[[hash-table.ko]]]
related: [[[hash-table.ko]], [[randomized-algorithms.ko]]]
source: [[[L10-hashing-and-amortization]]]
status: draft
---
# 유니버설·완전 해싱 (Universal & Perfect Hashing)

*(English: [Universal & Perfect Hashing](/portfolio/study/universal-hashing/))*

> 유니버설 함수족에서 해시를 무작위로 골라 어떤 적도 충돌을 많이 강제하지 못하게 한다.

## 개념
**유니버설 함수족(universal family)** $\mathcal H$ 는 서로 다른 두 키에 대해
$\Pr_{h\in\mathcal H}[h(x)=h(y)]\le 1/m$ 을 보장한다. 키가 고정된 *후* $h$ 를 무작위로 고르면
입력과 무관하게 기대 충돌이 작아진다.

## 왜 중요한가
고정 해시의 최악 $O(n)$ 을 없앤다: 어떤 적도 당신의 무작위 선택을 모르므로 *어떤* 입력에도 기대
$O(1)$ 연산이 성립한다 — 해시테이블의 엄밀한 토대.

## 세부
예시 족: $h_{a,b}(x)=((ax+b)\bmod p)\bmod m$, 무작위 $a,b$ 와 소수 $p$. **완전 해싱(perfect
hashing)** 은 정적 집합에 두 단계 유니버설 방식을 써서 $O(n)$ 공간으로 최악 $O(1)$ 조회를 준다.

## 관련
[해시 테이블 (체이닝) (Hash Tables, Chaining)](/portfolio/study/hash-table.ko/) · [무작위 알고리즘 (Randomized Algorithms)](/portfolio/study/randomized-algorithms.ko/)
