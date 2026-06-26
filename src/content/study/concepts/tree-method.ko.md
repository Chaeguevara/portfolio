---
type: concept
title: 트리 방법 (Tree Method, 종이접기 설계)
lang: ko
pair: "[[tree-method]]"
course: "6.849"
lectures: [3, 4, 5]
summary: 막대그림 트리의 가지를 정사각형 위에 원/강(circle/river)으로 채운 뒤 영역을 몰리큘로 채워 종이접기 베이스를 설계하는 방법.
tags: [origami, design, algorithms]
prereqs: [[[crease-pattern.ko]]]
related: [[[uniaxial-base.ko]], [[universal-molecule.ko]], [[box-pleating.ko]], [[flat-foldability-np-hardness.ko]]]
source: [[[L03-single-vertex-crease-patterns]], [[L04-efficient-origami-design]], [[L05-artistic-origami-design]]]
status: draft
---
# 트리 방법 (Tree Method, 종이접기 설계)

*(English: [Tree Method (Origami Design)](/portfolio/study/tree-method/))*

> 막대그림 트리의 가지를 정사각형 위에 원/강(circle/river)으로 채운 뒤 영역을 몰리큘로 채워 종이접기 베이스를 설계하는 방법.

## 개념
**트리 방법(tree method)** 은 목표 모양을 **거리 트리(metric tree)** (필요한 가지
길이를 가진 막대그림)로 추상화해, 그 트리에 맞는 [단축 베이스](/portfolio/study/uniaxial-base.ko/)로
접히는 크리스 패턴을 만든다. 각 잎(leaf) 플랩은 자기 길이만큼의 종이 원이 필요하고,
각 내부 변은 일정 폭의 "강(river)"이 필요하다. 이 원과 강을 정사각형에 **채운(pack)**
뒤, 남은 다각형을 [보편 몰리큘](/portfolio/study/universal-molecule.ko/)로 채운다. Robert Lang의
**TreeMaker** 로 구현되어 있다.

## 왜 중요한가
현대 복잡 종이접기 설계(곤충, 다리 많은 동물)의 *핵심* 알고리즘이다. "이 모양을 원해"를
구체적인 크리스로 변환한다.

## 세부
- 채우기의 **최적화**(최소 종이 / 최대 플랩)는 **NP-완전**이다 —
  [평평 접힘 난해성](/portfolio/study/flat-foldability-np-hardness.ko/) 결과 중 하나(Lecture 5).
- 맞닿는 원들 사이의 활성 경로(active path)가 베이스의 능선 크리스를 결정한다.
- [박스 플리팅](/portfolio/study/box-pleating.ko/)은 *Origami Design Secrets* 의 격자 정렬 이산화 변종.
- **Origamizer** 와 대비된다 — 다른 집어넣기(tucking) 기반 방법으로 임의 다면체 표면을
  (방수로) 접는다.

## 관련
[단축 베이스 (Uniaxial Base)](/portfolio/study/uniaxial-base.ko/) · [보편 몰리큘 (Universal Molecule)](/portfolio/study/universal-molecule.ko/) · [박스 플리팅과 보편 힌지 패턴 (Box Pleating)](/portfolio/study/box-pleating.ko/) · [평평 접힘의 NP-난해성 (NP-Hardness of Flat Foldability)](/portfolio/study/flat-foldability-np-hardness.ko/)
