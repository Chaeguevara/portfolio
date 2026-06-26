---
type: concept
title: 알렉산드로프 정리 (Alexandrov's Theorem)
lang: ko
pair: "[[alexandrov-theorem]]"
course: "6.849"
lectures: [16, 17, 18]
summary: 구면 위의 임의 볼록 다면체 거리는 유일한 볼록 다면체로 실현된다 — 그래서 다각형의 유효한 붙이기는 정확히 하나의 볼록 입체로 접힌다.
tags: [polyhedra, theorem, algorithms]
prereqs: [[[cauchy-rigidity-theorem.ko]], [[gluing-tree.ko]]]
related: [[[cauchy-rigidity-theorem.ko]], [[gluing-tree.ko]], [[d-form.ko]]]
source: [[[L16-vertex-orthogonal-unfolding]], [[L17-alexandrov-s-theorem]], [[L18-gluing-algorithms]]]
status: draft
---
# 알렉산드로프 정리 (Alexandrov's Theorem)

*(English: [Alexandrov's Theorem](/portfolio/study/alexandrov-theorem/))*

> 구면 위의 임의 볼록 다면체 거리는 유일한 볼록 다면체로 실현된다 — 그래서 다각형의 유효한 붙이기는 정확히 하나의 볼록 입체로 접힌다.

## 정리
**알렉산드로프 정리(Alexandrov, 1941):** 위상적 구면 위의 모든 **볼록 다면체 거리(convex
polyhedral metric)** (유한 개의 원뿔점을 빼면 국소적으로 평평하고, 각 원뿔점의 각이 ≤ 2π,
총 곡률 4π인 거리 측정 방식)는 **유일한** 볼록 다면체의 표면 거리다. 존재성이 알렉산드로프,
유일성이 [코시 정리](/portfolio/study/cauchy-rigidity-theorem.ko/)다.

## 왜 중요한가
**다각형을 다면체로 접기**의 주된 도구다: 평평한 다각형의 경계를 어떤 점에도 2π 넘는
재료가 모이지 않도록 붙이면(**알렉산드로프 붙이기**), 정리가 그 표면을 가진 볼록 다면체가
정확히 하나 존재함을 보장한다 — 단, 그 모양을 직접 알려주지는 않는다.

## 정리에서 알고리즘으로
- 알렉산드로프의 원래 증명은 비구성적이다. **보벤코-이즈메스티에프(Bobenko–Izmestiev)** 가
  구성적 증명을 주어, 다면체를 계산하는 **유사다항(pseudopolynomial)** 알고리즘으로 이어진다.
- 유효한 붙이기 찾기는 [붙이기 트리](/portfolio/study/gluing-tree.ko/)를 쓴다. 어떤 다각형은 붙이기가 없고,
  볼록 다각형은 항상 적어도 하나 있으며, "구르는 띠(rolling belt)"가 무한 족을 만든다.

## 응용
- **[D-폼](/portfolio/study/d-form.ko/)**, 피타 폼(pita form), 솔기 폼(seam form)(볼록 모양 붙이기).
- 사례 연구: 라틴 십자가·정삼각형·정사각형을 각자 허용하는 여러 볼록 다면체로 접기.

## 관련
[코시 강성 정리 (Cauchy's Rigidity Theorem)](/portfolio/study/cauchy-rigidity-theorem.ko/) · [붙이기 트리 (Gluing Tree)](/portfolio/study/gluing-tree.ko/) · [D-폼 (D-Form)](/portfolio/study/d-form.ko/)
