---
type: concept
title: 크라메르 공식과 부피 (Cramer's Rule)
lang: ko
pair: "[[cramers-rule]]"
course: "18.06"
lectures: [20]
summary: 행렬식 비로 Ax=b를 푼다. det는 사상 A의 부피 배율도 잰다.
tags: [determinants]
prereqs: [[[determinant.ko]], [[cofactor-expansion.ko]]]
related: [[[determinant.ko]], [[matrix-inverse.ko]]]
source: [[[L20-cramer-s-rule-inverse-matrix-and-volume]]]
status: draft
---
# 크라메르 공식과 부피 (Cramer's Rule)

*(English: [Cramer's Rule & Volume](/portfolio/study/cramers-rule/))*

> 행렬식 비로 Ax=b를 푼다. det는 사상 A의 부피 배율도 잰다.

## 개념
**크라메르 공식(Cramer's rule):** 가역 $A$ 에 대해
$$
x_i = \frac{\det B_i}{\det A},
$$
여기서 $B_i$ 는 $A$ 의 $i$ 열을 $b$ 로 바꾼 것이다. 또한 $|\det A|$ 는 $A$ 의 열들이 만드는
평행육면체의 **부피**이고, $A$ 는 모든 부피를 $|\det A|$ 배로 늘린다.

## 왜 중요한가
행렬식을 연립방정식 풀이와 기하(부피, 부호를 통한 방향)에 연결한다. 우아하고 이론적으로
중요하지만, 여인수 역행렬처럼 큰 계에는 **비실용적**(소거를 써라).

## 세부
- 방향(orientation): $\det A>0$ 은 보존, $<0$ 은 뒤집음.
- $\det = 0$ ⇒ 열들이 납작(부피 0) ⇒ 비가역.

## 관련
[행렬식 (Determinant)](/portfolio/study/determinant.ko/) · [여인수 전개 (Cofactor Expansion)](/portfolio/study/cofactor-expansion.ko/) · [역행렬 (Matrix Inverse)](/portfolio/study/matrix-inverse.ko/)
