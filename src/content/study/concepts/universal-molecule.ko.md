---
type: concept
title: 보편 몰리큘 (Universal Molecule)
lang: ko
pair: "[[universal-molecule]]"
course: "6.849"
lectures: [4]
summary: (트리 방법 채우기에서 나온) 볼록 다각형을 필요한 단축 플랩으로 접히게 하는 크리스로 채우는 알고리즘.
tags: [origami, design, algorithms]
prereqs: [[[uniaxial-base.ko]], [[tree-method.ko]]]
related: [[[tree-method.ko]], [[uniaxial-base.ko]], [[fold-and-one-cut.ko]]]
source: [[[L04-efficient-origami-design]]]
status: draft
---
# 보편 몰리큘 (Universal Molecule)

*(English: [Universal Molecule](/portfolio/study/universal-molecule/))*

> (트리 방법 채우기에서 나온) 볼록 다각형을 필요한 단축 플랩으로 접히게 하는 크리스로 채우는 알고리즘.

## 개념
[트리 방법](/portfolio/study/tree-method.ko/)이 원과 강을 정사각형에 채우고 나면 남는 영역은 볼록
다각형이다. **보편 몰리큘(universal molecule)** 은 그런 다각형 각각을 크리스로 채워
[단축 베이스](/portfolio/study/uniaxial-base.ko/)의 올바른 부분으로 평평하게 접히게 하는 Lang의
알고리즘이다. 다각형의 변을 반복적으로 안쪽으로 들이며(직선 골격 비슷한 수축)
무너질 때까지 진행하면서 크리스를 기록한다.

## 왜 중요한가
채워진 설계가 *실제로 평평하게 접히고* 원하는 플랩을 만들어내도록 보장하는 단계다.
틈을 채우는 몰리큘이 없으면 채우기는 계획에 불과하다.

## 세부
- 안쪽 들이기/수축 과정은 [한 번 자르기](/portfolio/study/fold-and-one-cut.ko/)에서 쓰는 **직선
  골격(straight skeleton)** 과 밀접하다.
- 유효한 채우기에서 나오는 임의 볼록 다각형에 작동하므로 "보편(universal)".
- 비볼록 영역은 일반화가 필요하다(그래서 Origamizer가 더 복잡함).

## 관련
[트리 방법 (Tree Method, 종이접기 설계)](/portfolio/study/tree-method.ko/) · [단축 베이스 (Uniaxial Base)](/portfolio/study/uniaxial-base.ko/) · [접고 한 번 자르기 (Fold-and-One-Cut)](/portfolio/study/fold-and-one-cut.ko/)
