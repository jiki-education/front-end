---
title: "값을 반환하는 함수들"
description: "함수의 배출구에서 튀어나오는 값을 받아 코드에서 사용하는 법"
en_md5: 830f19fb6aaf184c1f32ade792b60a12
---

지금까지는 세상에서 뭔가를 하는 함수들을 살펴봤어요. 그래서 `circle`(원) 함수는 원을 그리고, `move`(이동) 함수는 캐릭터를 움직여요. 하지만 어떤 함수들은 다르게 작동해요. 바깥 세상에 뭔가를 하는 대신, 코드 안에서 사용할 수 있는 무언가를 돌려줘요. 함수가 Jiki에게 코드에서 사용할 수 있도록 무언가를 돌려줄 때, 우리는 이 함수가 무언가를 **반환(영어: *returning*)한다**고 말해요. 그것을 Jiki에게 다시 내보내는 거예요. 이 기계들에는 출력 배출구가 있다고 생각하면 돼요. 우리에게는 이미 무언가를 넣을 수 있는 투입구가 있지만, 무언가가 다시 나올 수 있는 배출구 하나도 있을 수 있어요. Jiki가 기계의 버튼을 누르면, 기계가 윙윙 돌아가고, 마지막에 그 배출구에서 무언가가 툭 튀어나와요. 그것은 숫자일 수도 있고, 문자열일 수도 있어요. Jiki가 받아서 사용할 수 있는 무언가예요.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/machine-with-return-chute.webp"
  alt="옆면에 출력 배출구가 달려 있고, Jiki에게 값을 내보낼 준비가 된 기계"
  width="500"
  height="317"
/>

대부분의 함수들, 아마 95% 정도가 무언가를 반환해요. 수학 계산을 하고 그 값을 반환할 수도 있고, 문자열을 붙여서 결과 문자열을 돌려줄 수도 있어요. 아니면 그 기계를 실행할 때마다 현재 시간을 알려줄 수도 있어요. 마지막 예를 살펴볼까요? `getCurrentTime`(현재 시간 가져오기)라는 함수가 있다고 해봐요. Jiki가 그 기계를 실행할 때마다, 배출구에서 시간이 적힌 종이 한 장이 스르륵 나와요. 아마 14:35라고 적혀 있을 거예요.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/paper-out-of-chute.webp"
  alt="14:35라고 적힌 종이가 출력 배출구에서 나오고 있는 getCurrentTime 기계"
  width="500"
  height="312"
/>

그리고 `let`을 써서 반환된 값을 상자에 넣을 수 있어요:

```javascript
let time = getCurrentTime()
```

Jiki가 기계를 실행하고 배출구에서 현재 시간을 받아 `time`이라는 상자에 저장할 거예요.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/jiki-boxing-time.webp"
  alt="Jiki가 배출구에서 나온 14:35 종이를 time이라 적힌 상자에 넣고 있는 모습"
  width="372"
  height="400"
/>

여기서 중요한 점은, Jiki가 상자에 넣은 종이는 그 순간에 고정된다는 거예요. 프로그램이 실행되는 동안 실제 시간이 바뀌더라도, 상자에는 여전히 14:35라고 적힌 그 종이가 들어 있어요. 한 번 상자에 들어간 것은 그대로 굳어져요. 마법처럼 저절로 변하지 않아요. 나중에 다시 현재 시간을 상자에 넣고 싶다면, `getCurrentTime` 함수를 다시 써서 새로 받아야 해요.

무언가를 반환하는 대부분의 함수는 입력도 받아요. 예를 들어, 두 개의 문자열을 입력으로 받아서, 그것들을 공백으로 합친 결과를 반환하는 `join`(합치다) 함수가 있다고 해봐요. 그래서 `join` 기계에 `"Hello"`와 `"World"`를 입력하면, 배출구에서 `"Hello World"`라고 적힌 하나의 문자열이 나와요.

```javascript
join("Hello", "World"); // "Hello World"
```
