---
type: concept
title: "Ax = 0 풀기: 피벗·자유변수·RREF"
lang: ko
pair: "[[solving-ax-0]]"
course: "18.06"
lectures: [7]
summary: A를 RREF로 줄인다. 피벗 열은 피벗 변수를 정하고, 자유 열은 영공간을 생성하는 특수해를 준다.
tags: [subspaces, algorithms]
prereqs: [[[gaussian-elimination.ko]], [[nullspace.ko]]]
related: [[[nullspace.ko]], [[complete-solution-ax-b.ko]], [[rank.ko]]]
source: [[[L07-solving-ax-0-pivot-variables-special-solutions]]]
status: draft
---
Ax = 0 풀기: 피벗·자유변수·RREF

*(English: [Solving Ax = 0: Pivots, Free Variables, RREF](/portfolio/study/solving-ax-0/))*

> A를 RREF로 줄인다. 피벗 열은 피벗 변수를 정하고, 자유 열은 영공간을 생성하는 특수해를 준다.

## 개념
$A$ 를 **기약 행 사다리꼴(reduced row echelon form, RREF)** $R$ 로 행 축약한다. 피벗이 있는
열 ⇒ **피벗 변수(pivot variable)**, 없는 열 ⇒ **자유 변수(free variable)**. 자유변수 하나를
$1$, 나머지를 $0$ 으로 놓고 풀면 **특수해(special solution)** 가 나오고, 이들이 모여
[영공간](/portfolio/study/nullspace.ko/)의 기저를 이룬다.

## 왜 중요한가
$N(A)$ 와 랭크–nullity 계산의 구체적 절차다: 피벗 $r$ 개, 열 $n$ 개면 자유변수가 $n-r$ 개,
따라서 $\dim N(A)=n-r$.

## 세부
- RREF는 피벗 자리에 1, 그 위아래에 0을 가진다.
- 특수해 개수 = 자유변수 개수 = $n-r$.
- 같은 소거를 $b$ 까지 확장하면 $Ax=b$ 를 푼다([Ax = b의 완전해 (Complete Solution)](/portfolio/study/complete-solution-ax-b.ko/) 참고).

## 관련
[영공간 N(A) (Nullspace)](/portfolio/study/nullspace.ko/) · [랭크 (Rank)](/portfolio/study/rank.ko/) · [Ax = b의 완전해 (Complete Solution)](/portfolio/study/complete-solution-ax-b.ko/)
