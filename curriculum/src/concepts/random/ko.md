---
title: "랜덤 숫자"
description: "`Math.randomInt`와 최솟값, 최댓값을 사용해 함수가 실행될 때마다 다른 숫자를 얻는 방법"
en_md5: 5f41de1ca5327be4a86a69d801f1b6f9
---

프로그래밍을 하다 보면, 함수를 사용해 매번 다른 랜덤 숫자(영어: _random number_)를 반환받고 싶을 때가 많아요.

이런 특성은 여러모로 유용하지만, 특히 암호학에서 그 중요성이 커요. 기계들 사이에 공유할 코드를 만들 때, 그 코드가 랜덤해야 해킹되지 않거든요.

이런 작업을 도와주는 `Math.randomInt`(임의의 정수)라는 함수를 사용할 수 있어요. 가운데 점(`.`)이 보이시나요? 함수가 많아지면 여러 그룹으로 묶어서 정리하는데, `Math`(수학) 부분이 바로 이 함수가 속한 그룹 이름이에요. Jiki에게 작업실 선반의 어느 부분을 살펴볼지 알려주는 거죠. 여기서는 `Math` 구역이에요. 점은 그 구역으로 가서 함수를 찾으라는 뜻이에요. 지금은 너무 깊이 이해하지 않아도 돼요. 연습 문제의 지시 사항을 보면 어떤 함수를 사용할 수 있고 어떻게 사용하는지 항상 알려드릴 거예요. 중요한 건 Jiki가 이 함수를 사용할 때마다 매번 다른 숫자를 반환한다는 점인데, 한 가지 제약이 있어요. 이 함수에는 투입구가 두 개예요. 첫 번째는 기계가 반환할 수 있는 가장 작은 숫자, 두 번째는 가장 큰 숫자예요. 그래서 `Math.randomInt` 함수에 `10`과 `13`을 넣으면 항상 `10`, `11`, `12`, `13` 중 하나가 반환돼요. 하지만 실행할 때마다 다른 값이 나와요.

<img
  class="concept-image"
  src="/static/images/concept-assets/random/jiki-shelves-math.webp"
  alt="작업실 선반의 Math 구역으로 사다리를 타고 올라가는 Jiki"
  width="440"
  height="400"
/>

```javascript
Math.randomInt
```

<img
  class="concept-image"
  src="/static/images/concept-assets/random/function-two-inputs.webp"
  alt="위쪽에 투입구 두 개가 달린 Math.randomInt 기계"
  width="500"
  height="378"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/random/function-10-13.webp"
  alt="투입구에 10과 13이 들어가 10, 11, 12 또는 13을 만들어내는 Math.randomInt 기계"
  width="488"
  height="400"
/>

이제 캔버스의 랜덤 위치에 원을 그리고 싶다고 상상해봐요. `Math.randomInt`를 사용해서 `left`와 `top` 값을 매번 달라지게 만들되, 예를 들어 `10`과 `90` 사이로 제한할 수 있어요. 그러면 원이 캔버스 밖으로 나가거나 다른 원과 겹치지 않아요. 이 코드를 실행할 때마다 원은 조금씩 다른 위치에 그려질 거예요.
