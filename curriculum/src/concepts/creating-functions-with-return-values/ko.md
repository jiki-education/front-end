---
title: "함수에 반환값 추가하기"
description: "자신만의 함수에 `return` 키워드를 사용하여, 호출한 곳으로 값을 돌려주는 배출구를 만드는 방법을 배워요."
en_md5: 51d31f709a7051c29b499a31ad68555e
---

이제 입력이 있는 함수와 없는 함수를 만드는 방법을 알고 있어요. 마지막으로 배울 것이 하나 더 있는데, 이걸 배우면 함수 만들기 전문가가 될 거예요. 그건 바로 함수에 배출구를 달아주는 방법이에요.

반환값을 돌려주는 함수는 이미 많이 사용해 봤어요. `isAlienAbove`(위에 외계인이 있는지)는 true나 false를 반환해요. `Math.randomInt(1, 10)`(1에서 10 사이의 임의의 정수)는 임의의 숫자를 반환해요.

Jiki가 그 함수들을 사용할 때, 배출구에서 무언가가 튀어나오면, Jiki는 그걸 가져다가 사용할 수 있어요.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/output-chute.webp"
  alt="Jiki가 기계의 배출구로 값이 빠져나오는 것을 받고 있는 모습"
  width="500"
  height="312"
/>

이렇게 하려면 새로운 키워드가 하나 더 필요해요. 바로 `return` 키워드예요.

`return` 키워드는 미니 Jiki에게 배출구로 무언가를 밀어내라고 알려줘요.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/return-keyword-push.webp"
  alt="미니 Jiki가 기계 안에서 42라는 값을 배출구를 통해 밀어내는 모습"
  width="500"
  height="335"
/>

그럼 함수 하나를 만들어 볼게요. 이름은 `meaningOfLife`(인생의 의미)로 짓고, 이 함수의 일은 항상 숫자 `42`를 반환하는 것뿐이에요. 입력값은 없어요. 이렇게 써요:

```javascript
function meaningOfLife() {
  return 42
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/meaning-of-life-42.webp"
  alt="meaningOfLife 기계가 배출구로 숫자 42를 내보내는 모습"
  width="500"
  height="323"
/>

이제 코드의 어디서든 `meaningOfLife()`를 사용하면, 다른 어떤 값과 똑같이 숫자 `42`를 받아서 쓸 수 있어요. `let`으로 상자에 넣을 수도 있고, 다른 함수의 입력값으로 전달할 수도 있고, if 문에서 비교할 수도 있죠.

반환값이 있는 함수도 입력값을 받을 수 있어요. 예를 들어 `ageBracket(age)`(연령대) 함수를 만든다면, `age`가 18 미만이면 `"Sorry, too young"`을, 그렇지 않으면 `"Welcome"`을 반환할 수 있어요. 이 함수를 호출하는 쪽은 함수가 반환한 문자열을 그대로 받게 돼요.

```javascript
function ageBracket(age) {
  if (age >= 18) {
    return "Welcome"
  }
  return "Sorry, too young"
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/age-input.webp"
  alt="나이 값이 기계의 투입구로 떨어지고, 그에 따라 기계가 어떤 값을 반환할지 결정하는 모습"
  width="487"
  height="400"
/>

프로그래밍의 핵심은 바로 이렇게 동작해요. 이렇게 작은 구성 요소들을 많이 만들어서, 그것들을 조립해 프로그램을 완성하는 거죠.
