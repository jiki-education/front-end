---
title: "`not` 연산자"
description: "`!`를 사용해 불리언을 뒤집어요: true는 false로, false는 true로 바뀌며, 토글하거나 조건을 반전시킬 때 유용해요."
en_md5: 842c4a4e9cb1fd11c4318a1508296e27
---

지금까지 값들이 같은지 비교할 때 등호 세 개(`===`)를 써 왔어요. 하지만 같지 **않은지**를 확인하고 싶을 때도 있어요. 이럴 때는 느낌표(`!`) 뒤에 등호 두 개를 붙인 `!=`를 사용해요. 그리고 보통 프로그래밍에서 느낌표, 또는 미국 친구들이 부르는 대로 bang은 “아니다(not)”라는 뜻이에요. 자, 가게에서 일한다고 상상해 보세요. 경영진이 디스코 복장은 출입 금지라고 결정했어요.

<img
  class="concept-image"
  src="/static/images/concept-assets/logical-not/shop-bouncer.webp"
  alt="가게 문 앞에서 줄 선 사람들의 옷차림을 검사하는 경비원"
  width="451"
  height="400"
/>

“옷차림이 디스코가 아니면 문을 열어요”라고 말할 수 있어요. `if`문도 정확히 같은 방식으로 동작해요.

```javascript
if (outfit !== "disco") {
  openDoor()
}
```

조건은 두 값이 다르면 `true`를, 같으면 `false`를 반환해요. 그래서 똑같은 동작을 “옷차림이 디스코면 아무것도 하지 않고, 그렇지 않으면 문을 열어요”라고 써도 돼요. 하지만 보통은 `not` 연산자(영어: _operator_)를 사용해서 정확히 의도를 표현하는 것이 더 쉽고 깔끔해요.

이와 관련해서 한 가지 더 있어요. 때로는 `true`인 변수를 `false`로 뒤집거나, `false`인 변수를 `true`로 뒤집고 싶을 때가 있어요. 이런 걸로 어떤 상태를 추적할 수 있어요.

자, 왼쪽에서 오른쪽으로 튕겨 다니는 무언가가 있다고 상상해 보세요. 그리고 `movingRight`(오른쪽으로 이동 중인지를 나타내는 변수)라는 변수가 있어서, 오른쪽으로 이동해야 할 때 `true`예요. 하지만 오른쪽 끝에 닿으면 그걸 `false`로 토글(영어: _toggle_)하고 싶을 거예요.

<img
  class="concept-image"
  src="/static/images/concept-assets/logical-not/pong-court.webp"
  alt="퐁 스타일의 코트에서 패들과 공이 좌우로 튀는 모습, movingRight 변수를 토글하는 것을 보여줍니다"
  width="500"
  height="352"
/>

그래서 우리는 이렇게 할 수 있어요: “만약 `movingRight`가 true면 `movingRight`를 false로, 그렇지 않으면 true로 설정해요.” 이게 변수를 토글하는 한 가지 방법이에요. Jiki는 `movingRight`가 true인지 false인지 살펴보고, 그 반대 값을 계산해서 다시 상자에 넣어요.

```javascript
if (movingRight === true) {
  movingRight = false
} else {
  movingRight = true
}
```

하지만 더 깔끔한 방법이 있어요. 바로 앞서 본 느낌표, 즉 bang을 사용하는 거예요:

```javascript
movingRight = !movingRight
```

그러면 값이 반전돼요. `!movingRight`는 원래 값의 반대를 의미해요.

그래서 `movingRight`가 true였다면 이제는 false가 되고, false였다면 true가 돼요. Jiki는 상자 안에 현재 들어 있는 값을 가져와서, bang이 그 반대를 찾으라고 알려줘요. 그래서 true의 반대는 false, false의 반대는 true가 되고, 그걸 다시 상자에 넣는 거예요.

이건 앞서 본 긴 `if`/`else`문과 완전히 똑같지만, 훨씬 깔끔하고 간결하게 쓸 수 있어요.
