---
title: "펭귄"
description: "대칭인 펭귄 그림을 완성해 보세요."
en_md5: bff370c28fd178d8c0ac9f65e3384e81
---

이번 연습 문제에서는 처음으로 타원을 그려보고, Foxy Face에서 다뤘던 대칭에 대해서도 조금 더 생각해볼게요.

이 연습 문제에서는 타원을 사용해요. 타원은 원을 늘여 놓은 모양이에요. 원을 그릴 때처럼 중심점을 정하지만, 반지름 하나가 아니라 가로 반지름과 세로 반지름, 이렇게 두 개를 사용해요. 세로 반지름이 가로 반지름보다 크면 타원이 길쭉하게 보이고, 가로 반지름이 세로 반지름보다 크면 납작해 보여요. 두 반지름을 똑같이 만들면 다시 원이 돼요!

`ellipse`(타원) 함수는 5개의 입력을 받아요: 중심 위치(`centerX`(중심 x좌표), `centerY`(중심 y좌표)), 가로 반지름(`radiusX`(가로 반지름)), 세로 반지름(`radiusY`(세로 반지름)), 그리고 색깔입니다:

<img src="/static/images/exercise-assets/penguin/intro-ellipse.webp" alt="`ellipse` 함수 도식" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### 펭귄

이번 과제는 펭귄의 오른쪽을 그리는 거예요. 그리고 좌표에 마우스를 올리거나 대충 찍지 **않고** 그려보세요. 완성된 그림은 이렇게 생겼어요:

<img src="/static/images/exercise-assets/penguin/penguin-finished.webp" alt="펭귄" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

우리가 그림의 절반을 그려놨어요. 거기 있는 코드를 읽어보면 나머지 세부사항을 대칭이 되게끔 알아낼 수 있을 거예요. 기억하세요, 그리기 캔버스의 왼쪽 위는 `0,0`이고, 오른쪽 아래는 `100,100`이에요. 펭귄은 가운데 자리 잡고 있어요. 코 부분에서는 삼각형의 가운데 꼭짓점 좌표를 **바꾸세요**. 새 삼각형을 추가하지 마세요.

먼저 **"코드 실행"**을 눌러서 시작 이미지가 어떻게 보이는지 확인해 보세요. 즐겁게 해봐요!
