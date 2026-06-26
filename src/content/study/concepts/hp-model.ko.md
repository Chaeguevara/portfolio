---
type: concept
title: HP 모델 (HP Model)
lang: ko
pair: "[[hp-model]]"
course: "6.849"
lectures: [21]
summary: 아미노산을 소수성(H) 또는 극성(P)으로 보는 격자 모델. 최적(H–H 접촉 최대) 접힘은 NP-완전이다.
tags: [linkages, biology, complexity]
prereqs: [[[fixed-angle-linkage.ko]]]
related: [[[fixed-angle-linkage.ko]]]
source: [[[L21-hp-model-interlocked-chains]]]
status: draft
---
# HP 모델 (HP Model)

*(English: [HP Model of Protein Folding](/portfolio/study/hp-model/))*

> 아미노산을 소수성(H) 또는 극성(P)으로 보는 격자 모델. 최적(H–H 접촉 최대) 접힘은 NP-완전이다.

## 개념
**HP 모델** 은 ([고정각 링크](/portfolio/study/fixed-angle-linkage.ko/)의 역학이 아니라) 단백질 접힘 뒤의
*힘*에 대한 단순화된 이론이다. 각 아미노산을 **H**(소수성, hydrophobic) 또는 **P**(극성,
polar)로 라벨링한다. 체인을 격자에 놓고, 에너지는 인접한 H–H 쌍을 보상한다 — 소수성
잔기가 주변 물에서 숨는 것을 모델링. 예측된 접힘은 H–H 접촉을 최대화하는 격자 배치다.

## 왜 중요한가
접힘의 주된 구동력을 이산적이고 분석 가능한 형태로 포착한다. 그러나 접힘이 계산적으로
어렵다는 것을 보인다: 최적 HP 접힘 찾기는 **NP-완전**이다.

## 결과
- 최적 접힘의 **NP-완전성**, 그리고 괜찮은 **상수배 근사(constant-factor approximation)**
  알고리즘.
- **단백질 설계(protein design)** (*유일한* 최적 접힘을 갖는 서열 만들기)를 수업에서
  살핀다. 설계가 비슷하게 어려운지는 완전히 알려지지 않았다.

## 관련
[고정각 링크 (Fixed-Angle Linkage, 단백질 접힘)](/portfolio/study/fixed-angle-linkage.ko/)
