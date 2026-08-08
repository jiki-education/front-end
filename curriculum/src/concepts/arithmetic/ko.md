---
title: "산술"
description: "덧셈, 뺄셈, 곱셈, 나눗셈을 통해 변수들을 수학적으로 결합해서 값들이 서로 관계를 맺고 의존할 수 있도록 하는 방법"
en_md5: 7ce54754a3ca29896609a01a51b12377
---

지금까지 변수를 만들 때는 `50` 같은 숫자나 `"yellow"` 같은 문자열처럼 단순한 값만 사용했어요. 변수가 진짜 강력해지는 건 변수들을 서로 조합해서 사용할 수 있을 때예요. 예를 들어, 사각형의 왼쪽 모서리가 캔버스 가장자리에서 얼마나 떨어져야 하는지 말할 수 있게 되는 거죠.

프로그래밍에서는 덧셈, 뺄셈, 곱셈, 나눗셈 같은 평범한 기초 수학을 사용할 수 있고, 이미 설정한 변수들도 그 계산에 사용할 수 있어요.

캔버스에 사각형 하나를 그리고 싶다고 해봐요. 왼쪽과 오른쪽에서 각각 10만큼, 위쪽과 아래쪽에서 각각 20만큼 떨어진 곳에서 시작하도록 말이죠. 그러면 사각형이 캔버스 중앙에 놓이고, 세로보다 가로가 약간 더 긴 모양이 돼요.

<img
  class="concept-image"
  src="/static/images/concept-assets/arithmetic/rectangle-on-canvas.webp"
  alt="캔버스 중앙에 파란색 사각형이 있고, 왼쪽과 오른쪽에서 10씩, 위와 아래에서 20씩 떨어져 있는 모습"
  width="399"
  height="400"
/>

사각형을 그릴 때는 색깔 외에도 사각형의 `left`(왼쪽), `top`(위쪽), `width`(너비), `height`(높이)를 알아야 해요. 그럼 그걸 먼저 적어볼게요.

이제 실제로 `left`, `top`, `width`, `height` 값이 무엇이어야 하는지 계산해야 해요. 각각 설정해볼게요. `left`는 10이에요. `top`은 20이에요. `width`는 말이죠, `width`는 캔버스 크기 100에서 왼쪽 10과 오른쪽 10을 뺀 값이니까 80이에요. `height`는 캔버스 높이 100에서 위쪽 20과 아래쪽 20을 빼서 60이 돼요.

```javascript
let left = 10
let top = 20
let width = 80
let height = 60

rectangle(left, top, width, height, "blue")
```

그래서 이 변수들을 이렇게 설정할 수 있어요. `left`는 10, `top`은 20, `width`는 80, `height`는 60이에요. 그런데 이 사각형을 안쪽으로 조금 옮기고, 조금 더 작게 만들고 싶으면 어떻게 될까요? 왼쪽과 오른쪽에서 20만큼, 위와 아래에서 30만큼 떨어지게 수정하고 싶다면? 그땐 모든 걸 다시 계산해야 해요. `width`는 이제 100 - 20 - 20이 되고, `height`는 100 - 30 - 30이 돼요. 이건 분명히 제가 하고 싶은 것보다 훨씬 많은 일과 계산이에요. 그러니 대신 컴퓨터가 계산하도록 시키는 거죠.

`width`를 100에서 `left`를 뺀 값에서 `left`를 다시 빼도록 설정하고, `height`는 100에서 `top`을 뺀 값에서 `top`을 다시 빼도록 설정할 수 있어요. 위아래가 같으니까요. 또는 `width`를 100 - `left` _ 2, `height`를 100 - `top` _ 2로 적어도 돼요.

```javascript
let width = 100 - left * 2
let height = 100 - top * 2
```

이제 `left`나 `top`을 변경하면 `width`와 `height`도 함께 바뀌어요. 이렇게 서로 관계를 맺기 시작하는 거예요. 그럼 캔버스 크기는요? 지금은 100으로 가정했지만, 만약 캔버스가 가로 세로 200짜리로 바뀌면 어쩌죠? 그럴 때를 위해 `canvasSize`(캔버스 크기)라는 변수를 만들고 100으로 설정하는 게 좋겠어요. 그러면 `width`는 `canvasSize` - `left` _ 2, `height`는 `canvasSize` - `top` _ 2가 돼요.

```javascript
let canvasSize = 100
let left = 20
let top = 30
let width = canvasSize - left * 2 // 60
let height = canvasSize - top * 2 // 40

rectangle(left, top, width, height, "blue")
```

`let height = canvasSize - top * 2`라고 적었을 때 Jiki가 무슨 일을 하는지 생각해볼까요? 먼저 Jiki가 선반에서 `top` 상자를 꺼내서 그 안에 30이 들어 있는 걸 확인해요. 그리고 주머니 계산기를 꺼내 30 곱하기 2를 계산한 뒤 머릿속에 60이라고 적어둬요.

<img
  class="concept-image"
  src="/static/images/concept-assets/arithmetic/flow-of-images-1.webp"
  alt="Jiki가 선반에서 top 상자를 꺼내 30 곱하기 2가 60임을 계산하는 모습"
  width="377"
  height="400"
/>

그다음에 선반에서 `canvasSize` 상자를 꺼내서 100이 들어 있는 걸 확인하고, 100 - 60 = 40이라고 계산해요. 이제는 우리가 실제로 `let height = 40`이라고 말한 셈이라는 걸 Jiki도 알아요. 그래서 `let` 명령을 따라 새 상자를 가져온 뒤 거기에 `height`라고 적고, 그 안에 40을 넣어둬요. 나중에 `height`를 사용할 때는 그냥 40을 다시 꺼내서 쓰면 돼요.

<img
  class="concept-image"
  src="/static/images/concept-assets/arithmetic/flow-of-images-3.webp"
  alt="Jiki가 새 상자를 가져와 height라고 적고, 그 안에 40을 넣는 모습"
  width="462"
  height="400"
/>

연습 문제에서 모든 게 잘 동작하게 되면, 변수 값을 바꿔보면서 어떤 일이 일어나는지 지켜봐요. 값이 어떻게 커지고 작아지는지 살펴봐요. 시간을 두고, 각각이 어떤 관계를 맺고 있는지 곰곰이 생각해 봐요.
