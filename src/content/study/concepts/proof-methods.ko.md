---
type: concept
title: 증명 방법 (Proof Methods)
lang: ko
pair: "[[proof-methods]]"
course: "6.042J"
lectures: [1]
summary: "문장을 증명하는 표준 방법: 직접 증명, 경우 분할, 대우 증명, 모순법."
tags: [proofs]
prereqs: [[[propositions-and-logic.ko]]]
related: [[[induction.ko]], [[well-ordering-principle.ko]]]
source: [[[L01-introduction-and-proofs]]]
status: draft
---
증명 방법 (Proof Methods)

*(English: [Proof Methods](/portfolio/study/proof-methods/))*

> 문장을 증명하는 표준 방법: 직접 증명, 경우 분할, 대우 증명, 모순법.

## 개념
- **직접 증명(direct):** 가정에서 출발해 함의를 이어 결론에 도달.
- **경우 분할(by cases):** 전체를 빠짐없는 경우로 나눠 각각 증명.
- **대우(contrapositive):** $P\Rightarrow Q$ 대신 $\lnot Q\Rightarrow\lnot P$ 를 증명.
- **모순법(contradiction):** 부정을 가정해 불가능을 끌어냄.

## 왜 중요한가
방법 선택이 절반이다. "$\sqrt 2$ 가 무리수"는 모순법이 어울리고, "$n^2$ 이 짝수면 $n$ 이
짝수"는 대우가 어울린다.

## 세부
올바른 증명은 각 단계가 공리나 앞 단계로부터 추론 규칙으로 따라나와야 한다. 거짓 증명을
조심하라: 0 일 수 있는 값으로 나누기, 증명하려는 것을 가정하기.

## 관련
[명제·술어·한정사 (Propositions, Predicates, Quantifiers)](/portfolio/study/propositions-and-logic.ko/) · [수학적 귀납법 (Mathematical Induction)](/portfolio/study/induction.ko/) · [정렬 원리 (Well-Ordering Principle)](/portfolio/study/well-ordering-principle.ko/)
