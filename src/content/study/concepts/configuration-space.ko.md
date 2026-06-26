---
type: concept
title: 구성 공간 (Configuration Space)
lang: ko
pair: "[[configuration-space]]"
course: "6.849"
lectures: [10]
summary: 링크의 모든 유효 배치들의 공간. 접기 운동은 그 안의 경로이고, '갇힘(locked)'은 분리된 성분을 뜻한다.
tags: [linkages, topology]
prereqs: [[[linkage.ko]]]
related: [[[rigidity.ko]], [[locked-linkage.ko]], [[carpenters-rule-theorem.ko]]]
source: [[[L10-kempe-s-universality-theorem]]]
status: draft
---
# 구성 공간 (Configuration Space)

*(English: [Configuration Space](/portfolio/study/configuration-space/))*

> 링크의 모든 유효 배치들의 공간. 접기 운동은 그 안의 경로이고, '갇힘(locked)'은 분리된 성분을 뜻한다.

## 개념
링크의 **구성 공간(configuration space)** 은 막대 길이 제약을 만족하는 *모든* 구성(관절
배치)의 집합을 하나의 기하/위상 공간으로 본 것이다. **접기 운동(folding motion)** 은 이
공간을 지나는 연속 경로이고, 링크가 "움직인다"는 것은 그 구성 공간이 한 점이 아니라는
것과 정확히 같다.

## 왜 중요한가
물리적 질문을 위상으로 바꾼다:
- *A에서 B로 갈 수 있나?* → A와 B가 같은 **연결 성분(connected component)** 에 있나?
- *링크가 갇혔나?* → 현재 구성이 "펼친" 구성에 도달하려 떠날 수 없는 성분에 있나?
  ([갇힌 링크](/portfolio/study/locked-linkage.ko/) 참고)
- *강체인가?* → 구성이 고립되어 있나?([강성](/portfolio/study/rigidity.ko/) 참고)

## 세부
- 교차 금지인 2D 닫힌 체인(다각형)은 [목수자 정리](/portfolio/study/carpenters-rule-theorem.ko/)에 의해
  구성 공간이 연결을 유지한다.
- 고차원이 도움된다: 4D 열린 체인은 절대 갇히지 않는다(움직일 여유 공간이 더 많음).
- 구성 공간은 일반적으로 반대수적 집합(제곱한 막대 길이로부터 나온 다항식으로 정의)이다.

## 관련
[링크 (Linkage)](/portfolio/study/linkage.ko/) · [강성 (Rigidity)](/portfolio/study/rigidity.ko/) · [갇힌 링크 (Locked Linkage)](/portfolio/study/locked-linkage.ko/) · [목수자 정리 (Carpenter's Rule Theorem)](/portfolio/study/carpenters-rule-theorem.ko/)
