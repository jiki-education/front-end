---
title: "함수에 입력 추가하기"
description: "자신의 함수에 투입구를 추가해서 전달된 값에 따라 다른 일을 할 수 있도록 해요."
en_md5: f70d737888fcbda3306196ff069eb2f1
---

지금까지 만든 함수는 매번 정확히 같은 일만 해요. `turnAround`(돌아서기)는 항상 왼쪽으로 두 번 돌아요. `shootIfAlienAbove`(위쪽 외계인 확인 후 사격)는 항상 확인하고 쏘기만 해요.

하지만 이 강의에서 지금까지 사용해 온 함수들을 생각해보면, 입력값에 따라 서로 다른 일을 한다는 걸 알 수 있어요. `Rectangle`은 입력으로 left, top, width, height를 받고, 주어진 값에 따라 다른 사각형을 그려요.

이제 우리 함수에도 투입구를 추가해 볼 거예요.

이걸 하려면 두 가지를 알아야 해요. 첫 번째는 실제로 어떻게 쓰는지, 두 번째는 실제로 어떤 일이 일어나는지예요.

첫 번째는 아주 간단해요. 그냥 일반 괄호를 쓰고, 원하는 입력값의 이름을 넣으면 돼요.

그럼 여러 번 쏘는 함수를 만든다고 상상해볼까요? 이 함수를 `shootMany`(여러 번 쏘기)라고 부르겠습니다.

이렇게 써요:

```javascript
function shootMany(numShots) {
  // ...
}
```

이 함수를 사용할 때는 원하는 쏘는 횟수를 전달해서 호출해요:

```javascript
shootMany(5)
shootMany(2)
```

이제, 이게 핵심이에요. 코드가 실행될 때, 입력으로 넣은 값, `5`든 `2`든, 함수 안에 있는 모자를 쓴 미니 지키가 그 입력을 받아서 `numShots`(발사 횟수)라는 상자에 넣고, 그 상자를 함수 안의 선반에 올려놓아 여러분이 함수 코드에서 사용할 수 있게 해요.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/numshots-box.webp"
  alt="shootMany 기계 안에서 미니 지키가 입력값을 numShots라고 적힌 상자에 넣는 모습"
  width="500"
  height="376"
/>

다시 한번 설명해 볼게요.

`shootMany(5)`를 써서 함수를 사용할 때, 바깥에 있는 지키가 `5`를 가져와 `shootMany`의 투입구에 넣어요. 기계 안에서 미니 지키는 그 `5`를 꺼내서 `numShots`라는 상자에 넣어요. 왜냐하면 여러분이 그 투입구에 붙여준 이름이 `numShots`이니까요. 그러고 나서 그 상자를 기계 안 함수 내부의 선반에 올려놓아요.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/numshots-on-shelf.webp"
  alt="미니 지키가 shootMany 기계 안에서 numShots 상자를 선반에 올려놓는 모습"
  width="500"
  height="302"
/>

그리고 함수 안에서는 `numShots` 상자를 다른 상자처럼 그냥 사용하면 돼요. `numShots`라는 이름에 특별한 건 없어요. 원하는 아무 이름이나 붙여도 돼요. 이건 그저 미니 지키에게 '함수 안에 그 이름표가 붙은 상자를 항상 만들고, 그 투입구에 들어온 값을 그 상자에 넣어라'라는 지시일 뿐이에요.

상자에 값이 들어가면, 평소처럼 상자를 가지고 할 수 있는 건 다 할 수 있어요. `numShots` 상자를 반복 루프에 사용해서 정확히 그 횟수만큼 쏠 수 있어요. 그리고 입력은 여러 개도 가능해요. 쉼표로 구분하면 돼요. 예를 들어, 왼쪽 위 좌표를 기준으로 별을 그리는 `drawStar`(별 그리기)라는 함수가 있다면, 이렇게 써요:

```javascript
function drawStar(left, top) {
  // ...
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/draw-star-two-slots.webp"
  alt="drawStar 기계에 두 개의 투입구가 있고, 두 값을 따로 받는 모습"
  width="453"
  height="400"
/>

그리고 함수가 호출될 때, 미니 지키는 입력으로 들어온 값을 `left`(왼쪽), `top`(위쪽)이라는 상자에 저장하고, 그 상자들을 함수 안의 선반에 올려놓을 뿐이에요.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/draw-star-boxes-shelf.webp"
  alt="미니 지키가 drawStar 기계 안에서 두 입력값을 left, top 상자에 담아 선반에 보관하는 모습"
  width="431"
  height="400"
/>
