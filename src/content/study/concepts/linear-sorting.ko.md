---
type: concept
title: 선형 시간 정렬 (계수·기수 정렬)
lang: ko
pair: "[[linear-sorting]]"
course: "6.006"
lectures: [5]
summary: 키가 작은 정수일 때 계수·기수 정렬은 비교 없이 n개를 O(n)에 정렬한다.
tags: [sorting]
prereqs: [[[comparison-sorting.ko]]]
related: [[[comparison-sorting.ko]], [[hash-table.ko]]]
source: [[[L05-linear-sorting]]]
status: draft
---
# 선형 시간 정렬 (계수·기수 정렬)

*(English: [Linear-Time Sorting (Counting & Radix)](/portfolio/study/linear-sorting/))*

> 키가 작은 정수일 때 계수·기수 정렬은 비교 없이 n개를 O(n)에 정렬한다.

## 개념
$\Omega(n\log n)$ 한계는 *비교* 정렬에만 적용된다. **계수 정렬(counting sort)** 은 각 값과 같은
키 수를 세서 바로 배치 — $\{0,\dots,u-1\}$ 키에 $O(n+u)$. **기수 정렬(radix sort)** 은 계수
정렬을 자릿수별로 적용한다.

## 왜 중요한가
구조(정수 키)를 이용해 비교 하한을 넘어, 키가 작은 범위에 들면 진짜 선형 시간을 준다 — 정수·
문자열 정렬과 서브루틴으로 쓴다.

## 세부
계수 정렬은 **안정적** 이라 기수 정렬을 옳게 만든다: 최하위 자릿수부터 정렬. $\{0,\dots,n^c-1\}$
의 $n$ 키에 대해 기수 정렬은 상수 $c$ 에 대해 $O(cn)=O(n)$.

## 관련
[비교 정렬과 그 하한 (Comparison Sorting, Lower Bound)](/portfolio/study/comparison-sorting.ko/) · [해시 테이블 (체이닝) (Hash Tables, Chaining)](/portfolio/study/hash-table.ko/)
