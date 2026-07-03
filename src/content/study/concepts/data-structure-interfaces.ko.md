---
type: concept
title: 집합 대 수열 인터페이스 (Set vs Sequence Interfaces)
lang: ko
pair: "[[data-structure-interfaces]]"
course: "6.006"
lectures: [2]
summary: 자료구조가 지원해야 할 연산(인터페이스)을 그 구현 방식과 분리한다.
tags: [data-structures]
prereqs: [[[word-ram-model.ko]]]
related: [[[dynamic-array.ko]], [[hash-table.ko]], [[binary-search-tree.ko]]]
source: [[[L02-data-structures-and-dynamic-arrays]]]
status: draft
---
# 집합 대 수열 인터페이스 (Set vs Sequence Interfaces)

*(English: [Set vs Sequence Interfaces](/portfolio/study/data-structure-interfaces/))*

> 자료구조가 지원해야 할 연산(인터페이스)을 그 구현 방식과 분리한다.

## 개념
두 핵심 인터페이스:
- **수열(sequence):** 정해진 순서의 항목; **위치** 로 접근/삽입/삭제(처음, 끝, $i$ 번째).
- **집합(set):** 고유 키를 가진 항목; **키로 검색/삽입/삭제**, 그리고 최소/최대/후속.
자료구조는 어떤 비용 트레이드오프로 인터페이스를 구현하는 방법이다.

## 왜 중요한가
인터페이스를 먼저 고르고 구조를 고르는 것이 이 강의의 설계 규율이다 — 같은 집합 인터페이스를
배열·해시테이블·균형 BST 가 매우 다른 비용으로 충족한다.

## 세부
수열 구현: 배열(빠른 인덱스, 느린 중간 삽입), 연결 리스트(반대), 동적 배열(분할상환 빠른
추가). 집합 구현: 정렬 배열, 해시테이블, 균형 BST — 각자 다른 연산에 강하다.

## 관련
[동적 배열 (Dynamic Arrays)](/portfolio/study/dynamic-array.ko/) · [해시 테이블 (체이닝) (Hash Tables, Chaining)](/portfolio/study/hash-table.ko/) · [이진 탐색 트리 (Binary Search Trees)](/portfolio/study/binary-search-tree.ko/)
