---
type: concept
title: 강성 (Rigidity)
lang: ko
pair: "[[rigidity]]"
course: "6.849"
lectures: [11]
summary: 프레임워크가 강체라는 것은 그 운동이 자명한 것(회전·평행이동)뿐이라는 뜻. 강성 이론은 어떤 그래프가 강체인지를 특징짓는다.
tags: [linkages, rigidity, theorem]
prereqs: [[[linkage.ko]], [[configuration-space.ko]]]
related: [[[laman-theorem.ko]], [[infinitesimal-rigidity.ko]], [[cauchy-rigidity-theorem.ko]], [[rigid-origami.ko]]]
source: [[[L11-rigidity-theory]]]
status: draft
---
# 강성 (Rigidity)

*(English: [Rigidity (Generic & Minimal)](/portfolio/study/rigidity/))*

> 프레임워크가 강체라는 것은 그 운동이 자명한 것(회전·평행이동)뿐이라는 뜻. 강성 이론은 어떤 그래프가 강체인지를 특징짓는다.

## 개념
막대-관절 프레임워크가 **강체(rigid)** 라는 것은, 막대 길이를 보존하는 모든 운동이 전체의
강체 운동(회전 + 평행이동)뿐 — 내부 휘어짐이 없다 — 는 뜻이다. 아니면 **유연(flexible)**
하다. **강성 이론(rigidity theory)** 은 어떤 바탕 그래프가 프레임워크를 강체로 만드는지를
묻고, 링크가 애초에 접힐 수 있는지 묻기 위한 선행 개념이다.

## 핵심 개념
- **일반 강성(generic rigidity)** — 꼭짓점의 "거의 모든" 배치에 대한 강성. 그래서 정확한
  좌표가 아니라 그래프의 *조합적* 성질이 된다.
- **최소 (일반) 강성(minimal generic rigidity)** — 강체이지만 막대를 하나라도 빼면
  유연해짐.
- 2D에서는 [라만 정리](/portfolio/study/laman-theorem.ko/)가 특징짓는다. 3D에서는 좋은 조합적 특징이
  알려지지 않았다("더블 바나나(double banana)" 장애물).

## 왜 중요한가
과목 전체의 토대다: 구조 공학(건물·다리가 서 있나?), 생물학(접힌 단백질의 어느 부분이
여전히 움직이나), [강체 종이접기](/portfolio/study/rigid-origami.ko/), 링크가 움직이는지 판정. 볼록 다면체
경우가 [코시 강성 정리](/portfolio/study/cauchy-rigidity-theorem.ko/)다.

## 관련
[라만 정리 (Laman's Theorem)](/portfolio/study/laman-theorem.ko/) · [무한소 강성 (Infinitesimal Rigidity)](/portfolio/study/infinitesimal-rigidity.ko/) · [코시 강성 정리 (Cauchy's Rigidity Theorem)](/portfolio/study/cauchy-rigidity-theorem.ko/) · [텐세그리티 (Tensegrity)](/portfolio/study/tensegrity.ko/)
