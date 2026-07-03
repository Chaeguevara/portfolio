---
type: concept
title: 양의정부호 행렬 (Positive Definite Matrices)
lang: ko
pair: "[[positive-definite]]"
course: "18.06"
lectures: [25, 27]
summary: 모든 x≠0에 대해 x^TAx>0인 대칭 A. 동치로 모든 고유값·피벗·선행소행렬식이 양수.
tags: [special-matrices]
prereqs: [[[symmetric-matrix.ko]]]
related: [[[symmetric-matrix.ko]], [[least-squares.ko]]]
source: [[[L25-symmetric-matrices-and-positive-definiteness]], [[L27-positive-definite-matrices-and-minima]]]
status: draft
---
# 양의정부호 행렬 (Positive Definite Matrices)

*(English: [Positive Definite Matrices](/portfolio/study/positive-definite/))*

> 모든 x≠0에 대해 x^TAx>0인 대칭 A. 동치로 모든 고유값·피벗·선행소행렬식이 양수.

## 개념
대칭 $A$ 가 **양의정부호(positive definite)** 라는 것은 모든 0 아닌 $x$ 에 대해 이차형식
$x^TAx>0$ 이라는 뜻이다. 네 가지 동치 판정:
1. 모든 고유값 $\lambda_i>0$;
2. 모든 피벗 $>0$;
3. 모든 선행 주소행렬식(leading principal minor) $>0$;
4. 독립 열을 가진 어떤 $R$ 에 대해 $A=R^TR$.

## 왜 중요한가
양의정부호란 이차형식 $x^TAx$ 가 **유일한 최소를 가진 그릇(bowl)** 이라는 뜻 — 최적화·
안정성의 토대이며, [최소제곱](/portfolio/study/least-squares.ko/)에서 $A^TA$ 가 가역인 이유다.

## 세부
- **준양의정부호(semidefinite)** 는 $\ge 0$ 으로 완화(고유값 $\ge 0$); $A^TA$ 는 항상
  최소한 준양의정부호.
- 기하는 고유벡터를 축으로 하는 **타원체(ellipsoid)** $x^TAx=1$.

## 관련
[대칭 행렬과 스펙트럼 정리 (Symmetric Matrices)](/portfolio/study/symmetric-matrix.ko/) · [최소제곱 (Least Squares)](/portfolio/study/least-squares.ko/)
