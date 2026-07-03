---
type: concept
title: 강체 종이접기 (Rigid Origami)
lang: ko
pair: "[[rigid-origami]]"
course: "6.849"
lectures: [6, 9]
summary: 면(face)이 강체(평평)로 유지되고 크리스만 움직이는 접기 — 단단한 재료, 자가 접힘 시트, 건축의 모델.
tags: [origami, rigidity, applications]
prereqs: [[[crease-pattern.ko]], [[kawasaki-theorem.ko]]]
related: [[[rigidity.ko]], [[hypar-pleat-folding.ko]], [[tensegrity.ko]]]
source: [[[L06-architectural-origami]], [[L09-pleat-folding]]]
status: draft
---
# 강체 종이접기 (Rigid Origami)

*(English: [Rigid Origami](/portfolio/study/rigid-origami/))*

> 면(face)이 강체(평평)로 유지되고 크리스만 움직이는 접기 — 단단한 재료, 자가 접힘 시트, 건축의 모델.

## 개념
**강체 종이접기(rigid origami)** 에서는 크리스 사이의 다각형 면이 휘거나 늘어날 수 없다
— 면은 강체 패널이고, 운동은 오직 크리스(경첩)를 축으로 한 회전으로만 일어난다. "종이"가
유연한 종이가 아니라 금속·플라스틱·태양광 패널·자가 접힘 시트일 때 맞는 모델이다.

## 왜 중요한가
강체 접힘 가능성은 종이접기를 **공학·건축**에서 유용하게 만든다: 전개형 구조물, 접이식
지붕, 우주 태양돛, PC-MEMS 자가 접힘 로봇. 어떤 패턴은 종이로는 평평하게 접혀도 강체로는
*안* 접힌다 — 그래서 진짜로 더 강한 요구다.

## 세부
- **차수 4** 꼭짓점은 한 크리스가 다른 두 크리스 사이 각을 이등분할 때("룰링(ruling)"
  크리스) 강체로 접힌다. 그때 본질적으로 자유도 1을 가진다.
- 도구: [강성](/portfolio/study/rigidity.ko/) 이론과 강성 행렬([무한소 강성](/portfolio/study/infinitesimal-rigidity.ko/))이
  링크로부터 넘어온다.
- 소프트웨어(Tachi의 Rigid Origami Simulator, Freeform Origami, Origamizer)가 설계
  공간을 탐색한다. 많은 미해결 문제가 남아 있다(Lecture 6, 초청 강연).

## 관련
[강성 (Rigidity)](/portfolio/study/rigidity.ko/) · [무한소 강성 (Infinitesimal Rigidity)](/portfolio/study/infinitesimal-rigidity.ko/) · [플리트 접기와 쌍곡포물면 (Hypar)](/portfolio/study/hypar-pleat-folding.ko/) · [가와사키 정리 (Kawasaki's Theorem)](/portfolio/study/kawasaki-theorem.ko/)
