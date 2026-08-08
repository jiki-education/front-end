---
title: "줄무늬 천"
description: "각 줄무늬의 색상을 올바르게 선택하여 줄무늬 패턴을 짜보세요."
en_md5: ba93b39f1883d50139d243a16e3c204f
---

여러분은 줄무늬 천 한 뭉치를 만들기 위한 알고리즘을 설계하고 있어요. 완성하면 이런 모양이 돼요:

<svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="세로 줄무늬 20개: 양 끝은 보라색이고, 그 사이에 초록색, 파란색, 노란색 줄무늬가 있어요" style="width: 200px; height: 200px; display: block; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;padding:4px;margin-top:-8px">
  <rect x="0" y="0" width="5" height="100" fill="#A020F0" />
  <rect x="5" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="10" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="15" y="0" width="5" height="100" fill="#008000" />
  <rect x="20" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="25" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="30" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="35" y="0" width="5" height="100" fill="#008000" />
  <rect x="40" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="45" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="50" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="55" y="0" width="5" height="100" fill="#008000" />
  <rect x="60" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="65" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="70" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="75" y="0" width="5" height="100" fill="#008000" />
  <rect x="80" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="85" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="90" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="95" y="0" width="5" height="100" fill="#A020F0" />
</svg>

패턴은 `"yellow"`, `"blue"`, `"yellow"`, `"green"`이 반복되는 순서예요. 첫 번째와 마지막 줄무늬는 `"purple"`이에요.

작업할 도화지는 가로 `100`, 세로 `100`이에요. 너비가 `5`인 줄무늬를 `20`개 그려야 해요.

### 연습 문제 규칙

이 연습 문제는 단순히 `rectangle(...)` 문을 20개 나열해서는 풀 수 없어요. 코드는 어떤 크기의 천에도 대응할 수 있어야 해요. 사실, `rectangle(...)` (직사각형을 그리는 함수) 함수는 코드에서 한 번만 사용할 수 있어요!

대신, 지난 영상 강의에서 살펴본 나머지(영어: _remainder_) 연산자(영어: _operator_)를 사용하여 루프를 돌려야 해요. 문장의 순서를 신중하게 생각해 보세요. 그게 이 연습 문제를 성공하는 핵심이에요.

여유롭게 즐겨보세요!
