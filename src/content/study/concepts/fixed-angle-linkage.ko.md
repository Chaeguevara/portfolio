---
type: concept
title: 고정각 링크 (Fixed-Angle Linkage, 단백질 접힘)
lang: ko
pair: "[[fixed-angle-linkage]]"
course: "6.849"
lectures: [20]
summary: 막대 길이와 연속 막대 사이 각이 모두 고정된 3D 링크. 단백질 골격을 모델링한다.
tags: [linkages, biology, 3d]
prereqs: [[[linkage.ko]], [[locked-linkage.ko]]]
related: [[[locked-linkage.ko]], [[hp-model.ko]]]
source: [[[L20-protein-chains]]]
status: draft
---
# 고정각 링크 (Fixed-Angle Linkage, 단백질 접힘)

*(English: [Fixed-Angle Linkage (Protein Folding)](/portfolio/study/fixed-angle-linkage/))*

> 막대 길이와 연속 막대 사이 각이 모두 고정된 3D 링크. 단백질 골격을 모델링한다.

## 개념
**고정각 링크(fixed-angle linkage)** 는 막대 길이에 더해 **연속된 두 막대 사이 각**이
일정하게 유지되는 3D 체인/트리다. 이면각(비틀림) 회전만 자유롭다. 이것은 분자의 역학
모델 그 자체다: 화학 결합은 고정된 길이와 결합각을 가지며, 단백질 골격은 고정각
트리(고정각 체인으로 근사)다.

## 왜 중요한가
추상적 링크 접기에서 **단백질 접힘(protein folding)** 과 분자생물학으로 가는 다리다.
같은 갇힘/도달 가능성 질문이 생물학적으로 의미를 갖는다: 단백질이 어떤 모양에 도달할 수
있나, 평평해질 수 있나, 갇힐 수 있나.

## 핵심 질문 & 결과
- **스팬(span)** — 양 끝점을 가장 멀리/가깝게 접을 수 있는 정도.
- **평탄화(flattening)** — 자기교차 없는 평평 상태가 존재하나?(고정각 체인 평탄화는 강하게
  **NP-난해**.)
- **평평 상태 연결성** — 임의의 두 평평 상태 사이를 움직일 수 있나?
- **생산 가능 체인(producible chain)** — 단순 **리보솜(ribosome)** 모델이 생산할 수 있는
  상태(모든 평평 상태 포함)는 서로 모두 도달 가능.
- 에너지/격자 추상화가 [HP 모델](/portfolio/study/hp-model.ko/)이다.

## 관련
[링크 (Linkage)](/portfolio/study/linkage.ko/) · [갇힌 링크 (Locked Linkage)](/portfolio/study/locked-linkage.ko/) · [HP 모델 (HP Model)](/portfolio/study/hp-model.ko/)
