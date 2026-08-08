---
title: "`repeat` 루프"
description: "`repeat` 키워드를 사용하여 Jiki에게 중괄호 안의 코드를 지정한 횟수만큼 실행하도록 지시하는 방법."
en_md5: 8ae468aa2be428f22b6eef47b3bdea68
---

지금까지는 모든 것이 순차적으로, Jiki가 위에서부터 아래로 각 지시를 차례대로 따라가는 방식으로 작성되었어요.

이제는 Jiki가 이런 엄격한 위에서 아래로의 흐름을 벗어나는 방법을 살펴볼 거예요. 특히, 같은 코드 부분을 연속해서 여러 번 실행하도록 Jiki에게 지시하는 방법을 알아볼게요.

예를 들어, 미로 안에 있고 앞으로 10걸음 이동하고 싶다고 상상해 보세요. 이때 도움이 되는 `walk` 함수가 있지만, 만약 그게 없다면요? `move`(이동) 함수만 있다면 어떨까요?

`move`를 연속으로 10번 적는 대신, 무척 반복적이겠지만, 우리가 할 수 있어야 하는 것은 "야, Jiki, 내가 다음에 말할 걸 열 번 해 줘. `Move`." 라고 말하는 거예요.

코드에서 이렇게 하려면, 우리의 첫 번째 키워드(영어: _keyword_)를 사용할 수 있어야 해요. 키워드는 Jiki가 이해하는 지시예요. 키워드는 조금 기계처럼 보이지만, 기계는 아니에요. Jiki가 키워드를 보면 선반에서 기계를 찾지 않고, 그냥 무엇을 할지 알아요. Jiki의 머릿속에 이미 내장되어 있는 거예요. 이 강의에서는 약 20개의 서로 다른 키워드를 배울 예정인데, 그중 첫 번째가 바로 `repeat` 키워드예요.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-keywords-2.webp"
  alt="Jiki가 repeat, if, else, and, or 같은 키워드들에 둘러싸여 있고, 키워드는 Jiki가 이해하는 지시라는 설명이 적혀 있는 그림"
  width="358"
  height="400"
/>

`repeat` 키워드는 정확히 제가 위에서 말한 대로 작동해요. Jiki에게 "내가 다음에 말하는 것을 이 횟수만큼 반복해" 라고 지시하는 거예요. 이 코드를 한번 살펴봐요. 먼저, Jiki에게 어떤 일을 여러 번 할 거라고 알리기 위해 `repeat` 키워드를 사용해요. 그다음, Jiki가 그 일을 몇 번 반복할지를 일반 괄호(소괄호) 안에 넣고, 그 뒤에 중괄호를 써요. 그리고 그 중괄호 안에는 Jiki가 반복할 내용들이 들어가요. 이 패턴은 프로그래밍에서 아주 흔해요. 키워드를 쓰고, 보통 그 안에 몇 번 반복할지 같은 정보를 넣은 다음, 중괄호로 감싼 코드 블록(영어: _code block_)을 작성해요. 다시 미로 세계로 돌아가서, `move`, `move`, `move`, `move`라고 적는 대신, `repeat` 네 번 `move`라고 적을 수 있어요.

```javascript
repeat(4) {
  move()
}
```

Jiki는 그 코드를 보고 `move` 기계를 연속으로 네 번 사용할 거예요.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-running-loop.webp"
  alt="Jiki가 move 기계를 네 번 연속으로 사용하는 모습, 하나씩 차례로"
  width="421"
  height="400"
/>

중괄호 안에 한 가지 일만 넣어야 하는 제한도 없어요. Jiki는 여러 가지 일을 반복해서 할 수 있어요. Jiki에게 `move`하고, 그다음 `turnLeft`하고, 그 전체를 네 번 반복하라고 지시할 수 있어요. Jiki가 이 코드를 보면, `move` 기계, `turnLeft` 기계, `move` 기계, `turnLeft` 기계, `move` 기계… 이렇게 두 가지를 각각 네 번씩 실행할 때까지 계속할 거예요.

```javascript
repeat(4) {
  move()
  turnLeft()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/if-else-code.webp"
  alt="Jiki가 move 기계와 turnLeft 기계를 사용하고, 두 동작을 하나의 쌍으로 네 번 반복하는 모습"
  width="500"
  height="390"
/>

이런 반복 지시를 루프(영어: _loops_)라고 불러요. 그리고 조금씩 다르게 동작하는 다양한 루프를 사용할 수 있어요.

한 가지 더 알아둘 점이 있어요. 루프를 다룰 때는 코드를 깔끔하게 정리하는 게 아주 중요해요. 코드에 시각적으로 좋은 구조가 있으면, 무슨 일이 일어나는지 보기가 아주 쉬워져요. 하지만 그렇지 않으면, 즉 들여쓰기를 깔끔하게 하는 걸 잊거나 들여쓰기 방식이 뒤섞이면, 금방 혼란스러워져요. 그래서 이 강의에서는 항상 규칙이 있어요. 시작 중괄호는 항상 `repeat` 문(영어: _statement_)과 같은 줄에 놓아요. 끝 중괄호는 항상 그 문 다음 줄에 단독으로 놓고, 그 사이의 코드는 항상 공백 두 칸으로 들여 써요. 그러면 모든 게 아주 깔끔하게 유지돼요. 만약 이 규칙을 잊어버리거나 다른 방식으로 하면, 오류가 발생할 거예요.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/multiple-things-in-loop.webp"
  alt="Jiki가 루프의 코드 블록을 깔끔하게 유지하는 들여쓰기와 새 줄을 가리키는 모습"
  width="500"
  height="398"
/>
