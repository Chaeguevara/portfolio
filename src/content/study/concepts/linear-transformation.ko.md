---
type: concept
title: 선형변환 (Linear Transformations)
lang: ko
pair: "[[linear-transformation]]"
course: "18.06"
lectures: [30]
summary: T(cu+dv)=cT(u)+dT(v)를 만족하는 사상. 기저를 정하면 그런 사상은 곧 행렬이다.
tags: [transformations]
prereqs: [[[matrix-multiplication.ko]], [[independence-basis-dimension.ko]]]
related: [[[change-of-basis.ko]], [[matrix-multiplication.ko]], [[four-fundamental-subspaces.ko]]]
source: [[[L30-linear-transformations-and-their-matrices]]]
status: draft
---
# 선형변환 (Linear Transformations)

*(English: [Linear Transformations](/portfolio/study/linear-transformation/))*

> T(cu+dv)=cT(u)+dT(v)를 만족하는 사상. 기저를 정하면 그런 사상은 곧 행렬이다.

## 개념
**선형변환(linear transformation)** $T:V\to W$ 는 결합을 보존한다:
$T(cu+dv)=cT(u)+dT(v)$. $V$ 와 $W$ 의 기저를 고정하면 $T$ 는 **행렬** $A$ 로 표현된다(그
열은 기저 벡터들의 상). 역으로 모든 행렬은 선형사상이다.

## 왜 중요한가
이 과목의 추상적 핵심이다: 행렬은 단순한 수의 격자가 아니라 선형사상이다. 단사
($N(A)=\{0\}$), 전사($C(A)=W$), 가역성이 모두 [네 부분공간](/portfolio/study/four-fundamental-subspaces.ko/)에서
읽힌다.

## 세부
- 예: 회전, 사영, (다항식의) 미분, 적분.
- 사상의 합성 = 행렬의 곱.
- 행렬은 **고른 기저에 의존**한다 — 기저를 바꾸면 닮은 행렬이 나온다
  ([기저 변환 (Change of Basis)](/portfolio/study/change-of-basis.ko/) 참고).

## 관련
[기저 변환 (Change of Basis)](/portfolio/study/change-of-basis.ko/) · [행렬 곱셈 (Matrix Multiplication)](/portfolio/study/matrix-multiplication.ko/) · [네 기본 부분공간 (Four Fundamental Subspaces)](/portfolio/study/four-fundamental-subspaces.ko/)
