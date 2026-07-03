---
type: concept
title: 코시 강성 정리 (Cauchy's Rigidity Theorem)
lang: ko
pair: "[[cauchy-rigidity-theorem]]"
course: "6.849"
lectures: [16]
summary: 볼록 다면체는 그 면들과 붙이는 방식으로 (합동을 제외하고) 유일하게 결정된다 — 볼록 다면체는 강체다.
tags: [polyhedra, rigidity, theorem]
prereqs: [[[rigidity.ko]]]
related: [[[rigidity.ko]], [[alexandrov-theorem.ko]]]
source: [[[L16-vertex-orthogonal-unfolding]]]
status: draft
---
# 코시 강성 정리 (Cauchy's Rigidity Theorem)

*(English: [Cauchy's Rigidity Theorem](/portfolio/study/cauchy-rigidity-theorem/))*

> 볼록 다면체는 그 면들과 붙이는 방식으로 (합동을 제외하고) 유일하게 결정된다 — 볼록 다면체는 강체다.

## 정리
**코시 강성 정리(Cauchy, 1813):** 두 **볼록** 다면체가 대응하는 면이 합동이고 같은 조합적
패턴으로 붙어 있으면, 두 다면체 자체가 합동이다. 면을 강체 판, 변을 경첩으로 보면, 볼록
다면체는 **정확히 하나**의 볼록 실현을 가진다 — 휠 수 없다.

## 왜 중요한가
3D 볼록 모양에 대한 근본적 강성 사실이며, 다각형을 다면체로 **접기** 위한 선행 개념이다:
유일성을 보장하고, [알렉산드로프 정리](/portfolio/study/alexandrov-theorem.ko/)가 이를 존재성으로 끌어올린다.

## 증명 아이디어
그런 두 다면체가 다르다고 하자. 각 변에서 이면각이 상대보다 큰지(+) 작은지(−)를 표시한다.
조합적 보조정리가 각 꼭짓점 둘레의 부호 변화를 제한하고, (구면에서 오일러 공식을 쓴) 전역
계산이 부호가 일관되게 분포될 수 없음을 보인다 — 모순.

## 주의 / 확장
- **볼록성이 필수** — *비볼록* 다면체는 휠 수 있다(Connelly의 가요성 다면체).
- **알렉산드로프 유일성**으로 확장: 다각형 경계를 붙이면 최대 하나의 볼록 다면체가 나온다
  ([알렉산드로프 정리 (Alexandrov's Theorem)](/portfolio/study/alexandrov-theorem.ko/)).

## 관련
[강성 (Rigidity)](/portfolio/study/rigidity.ko/) · [알렉산드로프 정리 (Alexandrov's Theorem)](/portfolio/study/alexandrov-theorem.ko/)
