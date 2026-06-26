---
type: concept
title: 역행렬 (Matrix Inverse)
lang: ko
pair: "[[matrix-inverse]]"
course: "18.06"
lectures: [3]
summary: A^{-1}은 A를 되돌린다(AA^{-1}=I). 정사각·풀랭크일 때만 존재하며 가우스–조르당으로 구한다.
tags: [foundations]
prereqs: [[[matrix-multiplication.ko]], [[gaussian-elimination.ko]]]
related: [[[determinant.ko]], [[rank.ko]], [[gaussian-elimination.ko]]]
source: [[[L03-multiplication-and-inverse-matrices]]]
status: draft
---
# 역행렬 (Matrix Inverse)

*(English: [Matrix Inverse](/portfolio/study/matrix-inverse/))*

> A^{-1}은 A를 되돌린다(AA^{-1}=I). 정사각·풀랭크일 때만 존재하며 가우스–조르당으로 구한다.

## 개념
역행렬 $A^{-1}$ 은 $AA^{-1}=A^{-1}A=I$ 를 만족한다. 그러면 $Ax=b$ 의 유일한 해는
$x=A^{-1}b$. $2\times2$ 의 경우:
$$
\begin{bmatrix} a & b \\ c & d \end{bmatrix}^{-1}
= \frac{1}{ad-bc}\begin{bmatrix} d & -b \\ -c & a \end{bmatrix}
$$

## 왜 중요한가
가역성(invertibility)이 분기점이다: $A$ 가역 $\iff$ 풀 [랭크](/portfolio/study/rank.ko/) $\iff$
$\det A\ne 0$ $\iff$ $N(A)=\{0\}$ $\iff$ 열들이 독립. 이 과목의 "언제 풀리나 / 유일한가"
질문 대부분이 여기로 귀결된다.

## 세부
- **가우스–조르당:** $[\,A \mid I\,]$ 를 행 축약해 $[\,I \mid A^{-1}\,]$ 로.
- $(AB)^{-1} = B^{-1}A^{-1}$; $(A^T)^{-1} = (A^{-1})^T$.
- $A^{-1}$ 을 직접 계산하는 건 $Ax=b$ 를 푸는 효율적 방법이 거의 아니다 —
  [LU 분해](/portfolio/study/lu-factorization.ko/)를 쓴다. 역행렬은 이론, 소거는 계산.

## 관련
[행렬식 (Determinant)](/portfolio/study/determinant.ko/) · [랭크 (Rank)](/portfolio/study/rank.ko/) · [가우스 소거법 (Gaussian Elimination)](/portfolio/study/gaussian-elimination.ko/)
