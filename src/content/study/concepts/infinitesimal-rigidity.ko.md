---
type: concept
title: 무한소 강성 (Infinitesimal Rigidity)
lang: ko
pair: "[[infinitesimal-rigidity]]"
course: "6.849"
lectures: [12]
summary: "선형대수 검사: 강성 행렬(rigidity matrix)이 자명한 속도 배정만 허용하면 프레임워크는 무한소 강체."
tags: [linkages, rigidity, linear-algebra]
prereqs: [[[rigidity.ko]]]
related: [[[rigidity.ko]], [[tensegrity.ko]], [[laman-theorem.ko]]]
source: [[[L12-tensegrities-carpenter-s-rules]]]
status: draft
---
무한소 강성 (Infinitesimal Rigidity)

*(English: [Infinitesimal Rigidity](/portfolio/study/infinitesimal-rigidity/))*

> 선형대수 검사: 강성 행렬(rigidity matrix)이 자명한 속도 배정만 허용하면 프레임워크는 무한소 강체.

## 개념
각 관절에 속도 벡터를 배정하고, 어떤 배정이 모든 막대 길이를 **1차 근사로** 보존하는지
묻는다(각 막대의 양 끝점이 막대 방향 속도 성분이 같음). 이 해들이 **강성 행렬(rigidity
matrix)** 의 핵(kernel)을 이룬다. 해가 자명한 것(전역 회전·평행이동)뿐이면 프레임워크는
**무한소 강체(infinitesimally rigid)** 다.

## 왜 중요한가
강성을 선형화해, 선형대수(강성 행렬의 계수)로 **임의 차원에서 효율적으로 계산** 가능하게
한다 — 2D에서만 깔끔히 특징지어지는 조합적 일반 강성([라만 정리](/portfolio/study/laman-theorem.ko/))과 다르다.
무한소 강성 ⇒ 강성이고, 일반적으로 둘은 일치한다.

## 세부
- 각 막대 `(i,j)` 가 행 조건 `(pᵢ − pⱼ)·(vᵢ − vⱼ) = 0` 을 기여.
- 자명한 운동은 2D에서 3차원, 3D에서 6차원 공간을 이룬다. "강체"는 해 공간이 정확히
  그것뿐.
- [텐세그리티](/portfolio/study/tensegrity.ko/)(스트럿/케이블의 부등식 제약 추가)와 [[rigid-origami.ko|강체
  종이접기]]의 자연스러운 도구다.

## 관련
[강성 (Rigidity)](/portfolio/study/rigidity.ko/) · [텐세그리티 (Tensegrity)](/portfolio/study/tensegrity.ko/) · [라만 정리 (Laman's Theorem)](/portfolio/study/laman-theorem.ko/)
