---
title: "무지개"
description: "100개의 알록달록한 세로 막대로 무지개를 그려보세요."
en_md5: 18cf1d57b1f3683a4484b507528f9acb
---

100개의 세로 막대로 아름다운 무지개 무늬를 만들어 보세요. 결과는 이렇게 생겼어요:

<img src="/static/images/exercise-assets/rainbow/example.webp" alt="무지개" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

무지개는 `100`개의 막대로 이루어져 있고, 각 막대는 위에서 아래까지 이어지며 너비는 `1`이에요. 첫 번째 막대의 `x`는 `0`, 마지막 막대의 `x`는 `99`여야 해요.

색상을 설정하려면 `hsl(...)`(색상, 채도, 명도) 함수를 사용해요. 이 함수는 색상 문자열을 반환(영어: _returns_)해요. 그런 다음 이 값을 `rectangle(...)`(직사각형)의 마지막 입력으로 사용할 수 있어요. 채도(영어: _saturation_)와 명도(영어: _lightness_) 값은 `50` 정도로 설정하는 게 좋아요. 첫 번째 막대의 **색상(영어: _hue_)** 은 `0`이어야 해요. 색상은 막대마다 조금씩 증가해서 마지막에는 300쯤 돼요.
