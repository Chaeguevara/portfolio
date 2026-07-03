---
type: concept
title: 비둘기집 원리 (Pigeonhole Principle)
lang: ko
pair: "[[pigeonhole-principle]]"
course: "6.042J"
lectures: [17]
summary: n+1개를 n개 상자에 넣으면 어떤 상자엔 둘이 들어간다 — 단순하지만 강력한 셈 사실.
tags: [counting]
prereqs: [[[counting-principles.ko]]]
related: [[[inclusion-exclusion.ko]]]
source: [[[L17-counting-rules-ii]]]
status: draft
---
# 비둘기집 원리 (Pigeonhole Principle)

*(English: [Pigeonhole Principle](/portfolio/study/pigeonhole-principle/))*

> n+1개를 n개 상자에 넣으면 어떤 상자엔 둘이 들어간다 — 단순하지만 강력한 셈 사실.

## 개념
비둘기 $n+1$ 마리를 $n$ 개 집에 넣으면 적어도 한 집에 $\ge 2$. 일반화: $kn+1$ 개를 $n$ 개
상자에 넣으면 어떤 상자에 $\ge k+1$.

## 왜 중요한가
구성 없이 *존재* 를 증명한다. 큰 도시 두 사람의 머리카락 수가 같음; 임의의 6명에 서로 아는
3명 또는 서로 모르는 3명(램지); 수열에 긴 단조 부분수열이 있음.

## 세부
비둘기와 집을 잘 고르는 게 기술이다. 예: $\{1,\dots,2n\}$ 에서 임의의 $n+1$ 개 중 두
수는 서로소(연속) — $n$ 개 상자로 짝짓기.

## 관련
[셈하기: 합·곱 법칙과 전단사 (Counting Principles)](/portfolio/study/counting-principles.ko/) · [포함–배제 원리 (Inclusion–Exclusion)](/portfolio/study/inclusion-exclusion.ko/)
