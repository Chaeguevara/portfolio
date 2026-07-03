---
type: concept
title: 허프만 코딩 (Huffman Coding)
lang: ko
pair: "[[huffman-coding]]"
course: "6.046J"
lectures: [19]
summary: 가장 드문 두 기호를 반복 병합해 최적 접두사-자유 부호를 탐욕적으로 만든다.
tags: [greedy, compression]
prereqs: [[[greedy-algorithms.ko]]]
related: [[[greedy-algorithms.ko]], [[binary-heap.ko]]]
source: [[[L19-compression-and-huffman-coding]]]
status: draft
---
# 허프만 코딩 (Huffman Coding)

*(English: [Huffman Coding](/portfolio/study/huffman-coding/))*

> 가장 드문 두 기호를 반복 병합해 최적 접두사-자유 부호를 탐욕적으로 만든다.

## 개념
**접두사-자유 부호(prefix-free code)** 는 어느 것도 다른 것의 접두사가 아닌 비트열을 각 기호에
배정해 복호가 모호하지 않다. **허프만** 은 빈도가 가장 낮은 두 노드를 부모로 반복 병합해 잎이
기호인 이진 트리를 만들고, 경로가 각 부호를 준다.

## 왜 중요한가
증명 가능한 **최적** 기호 부호(최소 기대 길이)를 만든다 — 파일 압축(ZIP, JPEG, MP3 엔트로피
단계)의 기반.

## 세부
최소 힙으로 가장 드문 두 노드를 꺼내며, $n$ 번 병합으로 $O(n\log n)$. 최적성은 교환 논증이다:
가장 드문 두 기호를 가장 깊은 형제로 만들 수 있다. 기대 길이는 **엔트로피** 하한에 다가간다.

## 관련
[탐욕 알고리즘과 교환 논증 (Greedy, Exchange Argument)](/portfolio/study/greedy-algorithms.ko/) · [이진 힙과 우선순위 큐 (Binary Heaps, Priority Queues)](/portfolio/study/binary-heap.ko/)
