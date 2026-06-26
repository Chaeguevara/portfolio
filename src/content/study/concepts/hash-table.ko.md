---
type: concept
title: 해시 테이블 (체이닝) (Hash Tables, Chaining)
lang: ko
pair: "[[hash-table]]"
course: "6.006"
lectures: [4]
summary: 해시 함수로 고른 버킷에 키를 저장; 좋은 해시면 검색·삽입·삭제가 기대 O(1)이다.
tags: [data-structures, hashing]
prereqs: [[[data-structure-interfaces.ko]]]
related: [[[universal-hashing.ko]], [[linear-sorting.ko]]]
source: [[[L04-hashing]]]
status: draft
---
# 해시 테이블 (체이닝) (Hash Tables, Chaining)

*(English: [Hash Tables (Chaining)](/portfolio/study/hash-table/))*

> 해시 함수로 고른 버킷에 키를 저장; 좋은 해시면 검색·삽입·삭제가 기대 O(1)이다.

## 개념
해시 함수 $h$ 는 키를 버킷 인덱스 $h(k)\in\{0,\dots,m-1\}$ 로 보낸다. **체이닝(chaining)** 은
충돌 시 버킷마다 연결 리스트를 둔다. $m\approx n$ 버킷에 $n$ 키를 고르게 분산하는 해시면 각
연산이 **기대** $O(1)$.

## 왜 중요한가
가장 빠른 범용 집합/사전이다 — $O(1)$ 기대 조회가 균형 트리의 $O(\log n)$ 을 이긴다 — 키를
순서대로 둘 필요 없는 곳 어디서나 쓴다.

## 세부
적재율 $\alpha=n/m$ 이 체인 길이를 좌우한다; 동적 배열처럼 리사이즈해 $\alpha=O(1)$ 유지.
모든 키가 충돌하면 최악 $O(n)$ 인데, **유니버설 해싱** 이 $h$ 를 무작위로 골라 이를 드물게
만든다.

## 관련
[유니버설·완전 해싱 (Universal & Perfect Hashing)](/portfolio/study/universal-hashing.ko/) · [집합 대 수열 인터페이스 (Set vs Sequence Interfaces)](/portfolio/study/data-structure-interfaces.ko/) · [선형 시간 정렬 (계수·기수 정렬)](/portfolio/study/linear-sorting.ko/)
