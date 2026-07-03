---
type: concept
title: SVG 크리스 패턴 포맷 (SVG Crease Pattern Format)
lang: ko
pair: "[[svg-crease-pattern-format]]"
summary: 사실상의 교환 규약 — stroke 색이 크리스 종류(검정 테두리, 빨강 산, 파랑 골)를, stroke 불투명도가 접힘각/180° 를 인코딩한다.
tags: [origami, file-format, implementation]
prereqs: [[[crease-pattern.ko]], [[mountain-valley-assignment.ko]]]
related: [[[crease-pattern-import-pipeline.ko]]]
source: []
status: draft
---
# SVG 크리스 패턴 포맷 (SVG Crease Pattern Format)

*(English: [SVG Crease Pattern Format](/portfolio/study/svg-crease-pattern-format/))*

> 사실상의 교환 규약 — stroke 색이 크리스 종류(검정 테두리, 빨강 산, 파랑
> 골)를, stroke 불투명도가 접힘각/180° 를 인코딩한다.

## 개념
Origami Simulator 가 정착시킨 평범한 SVG 규약: 어떤
`line`/`path`/`rect`/`polyline`/`polygon` 이든 크리스이고, 오직 stroke 색으로
분류된다 — **검정** 테두리, **빨강** 산, **파랑** 골, **노랑** 사전 지정
facet, **마젠타** 자유 힌지, **초록** 절단. 목표 접힘각은
`opacity × stroke-opacity × 180°`, 산은 음수. 아무 드로잉 툴이나 크리스 패턴
편집기가 된다.

## 왜 중요한가
규약을 지키는 툴 사이에서 파일이 왕복한다: Illustrator 로 그린 패턴이
origamisimulator.org 에도, `/portfolio/simulator` 에도 로드되고, 어느 쪽에서
내보낸 패턴이든 접힘 의미가 기계 판독 가능한 채로 손 접기용 도면으로
인쇄된다.

## 세부
- 색 매칭은 여섯 색의 이름/hex/rgb 표기와의 정확 일치 — `#fe0000` 같은
  어긋난 빨강은 추측하지 않고 무시(및 보고)한다.
- 불투명도가 없으면 기본 1 → ±180° 완전 접기.
- 지오메트리에는 위상이 없다: 끝점은 *거의만* 일치하고 교차는 암묵적 —
  접기 그래프 복원은 [임포트 파이프라인](/portfolio/study/crease-pattern-import-pipeline.ko/)의
  몫이다.
- 부분각 크리스 (예: Miura 90° 벽)는 그저 불투명도가 낮은 stroke 다.

## 관련
[크리스 패턴](/portfolio/study/crease-pattern.ko/) · [크리스 패턴 임포트 파이프라인](/portfolio/study/crease-pattern-import-pipeline.ko/)
