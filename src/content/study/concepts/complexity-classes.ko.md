---
type: concept
title: "복잡도 클래스: P, NP, EXP (Complexity Classes)"
lang: ko
pair: "[[complexity-classes]]"
course: "6.006"
lectures: [19]
summary: 문제를 풀거나 검증하는 자원으로 분류한다; P는 효율적으로 풀리고, NP는 효율적으로 검증된다.
tags: [complexity]
prereqs: [[[asymptotic-notation.ko]]]
related: [[[np-completeness.ko]], [[pseudopolynomial.ko]]]
source: [[[L19-complexity]]]
status: draft
---
복잡도 클래스: P, NP, EXP (Complexity Classes)

*(English: [Complexity Classes: P, NP, EXP](/portfolio/study/complexity-classes/))*

> 문제를 풀거나 검증하는 자원으로 분류한다; P는 효율적으로 풀리고, NP는 효율적으로 검증된다.

## 개념
- **P:** 다항 시간에 풀리는 결정 문제.
- **NP:** "예" 답에 다항 시간 **검증** 가능한 증서(certificate)가 있는 문제.
- **EXP:** 지수 시간에 풀림.
$\text{P}\subseteq\text{NP}\subseteq\text{EXP}$. $\text{P}=\text{NP}$ 여부가 유명한 미해결
문제다.

## 왜 중요한가
빠른 정확 알고리즘 탐색을 언제 멈출지 알려준다. 문제가 NP-난해면 다항 알고리즘은 NP 전체를
풀게 되므로, 근사·휴리스틱·특수 경우로 돌아선다.

## 세부
NP 의 모든 것이 환원되면 **NP-난해(NP-hard)**, 거기에 NP 에도 속하면 **NP-완전(NP-complete)**.
환원이 난해성을 전달한다. 더 어려운 문제도 있다(정지 문제처럼 결정 불가능).

## 관련
[NP-완전성과 환원 (NP-Completeness, Reductions)](/portfolio/study/np-completeness.ko/) · [유사다항 시간과 부분집합 합 (Pseudopolynomial, Subset Sum)](/portfolio/study/pseudopolynomial.ko/) · [점근 표기법 (Big-O)](/portfolio/study/asymptotic-notation.ko/)
