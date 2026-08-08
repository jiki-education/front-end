---
title: "벽 고치기"
description: "직사각형으로 부서진 벽의 틈을 메우세요."
en_md5: ba2f5a5d726cef8cb80841c6e16132c6
---

첫 그림 그리기 연습 문제예요. 이번 문제에서는 `rectangle`(직사각형) 함수(영어: _function_)를 사용해서 직사각형을 그려볼 거예요.

직사각형을 그리려면 사각형의 위쪽과 왼쪽 위치, 그리고 너비와 높이를 알아야 해요. `rectangle` 함수를 사용할 때는 이 값들을 입력(영어: _input_)으로 지정할 수 있어요.

- `left`(왼쪽): 사각형의 왼쪽 변
- `top`(위): 사각형의 위쪽 변
- `width`(너비): 사각형의 너비
- `height`(높이): 사각형의 높이

<img src="/static/images/exercise-assets/fix-wall/intro-rectangle.webp" alt="벽 고치기" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

그리기 영역은 항상 너비 100, 높이 100인 캔버스예요. 따라서 캔버스의 왼쪽 위가 `0,0`이고 오른쪽 아래가 `100,100`이에요. **캔버스 위에 마우스를 올려보면** 필요한 위치를 확인할 수 있어요.

### 벽 고치기

세 개의 직사각형으로 벽에 난 구멍을 메우는 게 과제예요.

편하게 하기 위해, 위쪽, 왼쪽, 높이, 너비 값이 모두 10의 배수예요.
