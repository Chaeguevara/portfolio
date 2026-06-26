---
type: concept
title: 워드-RAM 모델 (Word-RAM Model)
lang: ko
pair: "[[word-ram-model]]"
course: "6.006"
lectures: [1, 2]
summary: "비용 모델: 메모리는 w비트 워드들이고, 한 워드에 대한 기본 연산은 O(1) 시간이다."
tags: [foundations, models]
prereqs: [[[computational-problem.ko]]]
related: [[[dynamic-array.ko]], [[hash-table.ko]]]
source: [[[L01-algorithms-and-computation]], [[L02-data-structures-and-dynamic-arrays]]]
status: draft
---
워드-RAM 모델 (Word-RAM Model)

*(English: [The Word-RAM Model](/portfolio/study/word-ram-model/))*

> 비용 모델: 메모리는 w비트 워드들이고, 한 워드에 대한 기본 연산은 O(1) 시간이다.

## 개념
메모리는 **워드(word)** 배열이고 각 워드는 $w$ 비트($w\ge\log n$ 이라 워드가 입력을 인덱싱
가능). 알려진 주소의 워드 읽기/쓰기, 워드에 대한 산술·비교·논리가 각각 $O(1)$.

## 왜 중요한가
*무엇이 한 단계인지* 를 고정해 실행시간 주장을 정밀하게 만든다. 배열 인덱싱과 정수 산술을
상수시간으로 다루는 것을 정당화하며, 대부분의 분석이 이를 가정한다.

## 세부
$w\ge\log n$ 가정 덕에 포인터나 인덱스가 한 워드에 들어간다. 자료구조는 워드로 만든다:
배열은 $O(1)$ 인덱싱; 포인터 구조(연결 리스트, 트리)는 한 단계당 워드 하나를 따라간다.

## 관련
[동적 배열 (Dynamic Arrays)](/portfolio/study/dynamic-array.ko/) · [해시 테이블 (체이닝) (Hash Tables, Chaining)](/portfolio/study/hash-table.ko/) · [점근 표기법 (Big-O)](/portfolio/study/asymptotic-notation.ko/)
