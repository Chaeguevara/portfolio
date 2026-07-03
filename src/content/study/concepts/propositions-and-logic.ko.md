---
type: concept
title: 명제·술어·한정사 (Propositions, Predicates, Quantifiers)
lang: ko
pair: "[[propositions-and-logic]]"
course: "6.042J"
lectures: [1]
summary: 명제는 참/거짓이 정해지는 문장이고, 술어는 변수를 더한 것이며 한정사(전칭/존재)가 그 변수를 묶는다.
tags: [logic, proofs]
prereqs: []
related: [[[proof-methods.ko]], [[induction.ko]]]
source: [[[L01-introduction-and-proofs]]]
status: draft
---
# 명제·술어·한정사 (Propositions, Predicates, Quantifiers)

*(English: [Propositions, Predicates & Quantifiers](/portfolio/study/propositions-and-logic/))*

> 명제는 참/거짓이 정해지는 문장이고, 술어는 변수를 더한 것이며 한정사(전칭/존재)가 그 변수를 묶는다.

## 개념
**명제(proposition)** 는 참/거짓이 분명하다. $\land$(그리고), $\lor$(또는), $\lnot$(부정),
$\Rightarrow$(함의)로 결합한다. **함의** $P\Rightarrow Q$ 는 $P$ 가 참이고 $Q$ 가 거짓일 때만
거짓이다. **술어(predicate)** $P(x)$ 는 $x$ 를 정하면 명제가 되고, **한정사(quantifier)** 가
다시 하나의 문장으로 만든다: $\forall x\,P(x)$, $\exists x\,P(x)$.

## 왜 중요한가
모든 증명이 쓰여지는 언어다. 한정사 부정 —
$\lnot\forall x\,P(x)\equiv\exists x\,\lnot P(x)$ — 을 정확히 다루는 것이 모순법과 반례
논증의 핵심 동작이다.

## 세부
핵심 동치: 대우 $P\Rightarrow Q\equiv\lnot Q\Rightarrow\lnot P$; 드모르간
$\lnot(P\land Q)\equiv\lnot P\lor\lnot Q$. 한정사 순서는 중요하다:
$\forall x\,\exists y$ 와 $\exists y\,\forall x$ 는 다르다.

## 관련
[증명 방법 (Proof Methods)](/portfolio/study/proof-methods.ko/) · [수학적 귀납법 (Mathematical Induction)](/portfolio/study/induction.ko/)
