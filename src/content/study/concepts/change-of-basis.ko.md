---
type: concept
title: 기저 변환 (Change of Basis)
lang: ko
pair: "[[change-of-basis]]"
course: "18.06"
lectures: [31]
summary: 같은 벡터/사상이 기저마다 다른 좌표를 가진다. B = M^{-1}AM으로 연결.
tags: [transformations]
prereqs: [[[linear-transformation.ko]], [[diagonalization.ko]]]
related: [[[linear-transformation.ko]], [[diagonalization.ko]], [[singular-value-decomposition.ko]]]
source: [[[L31-change-of-basis-image-compression]]]
status: draft
---
# 기저 변환 (Change of Basis)

*(English: [Change of Basis](/portfolio/study/change-of-basis/))*

> 같은 벡터/사상이 기저마다 다른 좌표를 가진다. B = M^{-1}AM으로 연결.

## 개념
기저를 바꾸면 벡터의 **좌표(coordinates)** 가 바뀐다. $M$ 이 새 기저 벡터들을 열로 가지면
옛 좌표와 새 좌표가 $M$ 으로 연결된다. 선형사상의 행렬은 **닮음(similarity)** 으로 바뀐다:
$$
B = M^{-1} A M.
$$

## 왜 중요한가
좋은 기저를 고르면 사상이 단순해진다. [대각화](/portfolio/study/diagonalization.ko/)가 바로 "고유벡터 기저로
바꾸기"이며, 거기서 $A$ 가 대각 $\Lambda$ 가 된다. [SVD](/portfolio/study/singular-value-decomposition.ko/)는 두
기저($U$, $V$)를 써서 임의의 $A$ 를 대각으로 만든다.

## 세부
- 기저 변환에 불변인 성질: 고유값, trace, 행렬식, 랭크.
- 응용: **이미지 압축**은 좋은 기저(예: SVD/웨이블릿/푸리에)에서 큰 계수만 남긴다.

## 관련
[선형변환 (Linear Transformations)](/portfolio/study/linear-transformation.ko/) · [대각화와 거듭제곱 (Diagonalization & Powers)](/portfolio/study/diagonalization.ko/) · [특이값 분해 (SVD)](/portfolio/study/singular-value-decomposition.ko/)
