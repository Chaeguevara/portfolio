---
type: concept
title: 경쟁 분석 (온라인 알고리즘) (Competitive Analysis)
lang: ko
pair: "[[competitive-analysis]]"
course: "6.046J"
lectures: [12]
summary: 미래를 모르는 온라인 알고리즘을 최적 오프라인 해 대비 최악 비율로 평가한다.
tags: [analysis, online]
prereqs: [[[amortized-analysis.ko]]]
related: [[[amortized-analysis.ko]]]
source: [[[L12-competitive-analysis]]]
status: draft
---
# 경쟁 분석 (온라인 알고리즘) (Competitive Analysis)

*(English: [Competitive Analysis (Online Algorithms)](/portfolio/study/competitive-analysis/))*

> 미래를 모르는 온라인 알고리즘을 최적 오프라인 해 대비 최악 비율로 평가한다.

## 개념
**온라인(online)** 알고리즘은 미래를 못 보고 입력이 도착하는 대로 결정해야 한다. 모든 열에서
비용이 최선의 *오프라인* 비용(전체 입력을 앎)의 최대 $c$ 배면 **$c$-경쟁적($c$-competitive)**
이다.

## 왜 중요한가
결정을 미룰 수 없을 때의 올바른 잣대다 — 캐싱, 페이징, 부하 분산, 살까-빌릴까 문제 — 최악 대
최적이 정직한 비교다.

## 세부
**스키 대여:** 하루 \$1 대여 또는 \$B 구매; $B$ 일까지 빌리다 사면 $2$-경쟁적. 자기조직
리스트의 **맨앞으로 이동(move-to-front)** 은 $2$-경쟁적. 하한이 어떤 비율은 피할 수 없음을
보이며, 무작위화가 이를 개선할 수 있다.

## 관련
[분할상환 분석 (Amortized Analysis)](/portfolio/study/amortized-analysis.ko/)
