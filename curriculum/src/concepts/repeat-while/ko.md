---
title: "횟수 없는 반복"
description: "`repeat`문의 괄호를 비워두면 Jiki가 멈추라는 지시가 있을 때까지 계속 나아가요."
en_md5: 5902e86c82b7bfe9ca519f9bdf8650ad
---

지금까지 `repeat`문을 사용할 때는 항상 몇 번 반복할지 숫자를 정해 줬어요. "5번 반복해", "10번 반복해", "40번 반복해" 같은 식으로요. 변수를 써서 횟수를 정한 적도 있어요. 하지만 어떤 때에는 미리 몇 번 반복해야 할지 알 수 없어요. 미로를 생각해 보세요. 이 강의 초반에는 미로를 풀 때 구체적인 동작을 하나하나 써서 해결했어요. 미로를 보면서 걸음 수를 세고, 알맞은 동작 개수를 적었죠.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/maze-known-path.webp"
  alt="캐릭터가 경로를 보고 걸음 수를 세서 정확히 올바른 동작을 쓸 수 있는 미로"
  width="418"
  height="400"
/>

```javascript
move()
move()
turnLeft()
move()
move()
```

하지만 누군가 "내가 주는 어떤 미로든 풀 수 있는 코드를 작성해 보세요"라고 말한다면요? 그 미로는 10걸음이 필요할 수도, 50걸음, 200걸음이 필요할 수도 있어요. 미리 전혀 알 수 없죠.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/maze-example.webp"
  alt="여러 가지 모양과 크기의 다양한 미로들, Jiki가 그 어느 것이든 풀 방법을 고민하고 있는 모습"
  width="402"
  height="400"
/>

그래서 Jiki에게 그냥 계속 나아가라고 지시할 방법이 필요해요. 갈 수 있는 방향을 계속 확인하고, 판단을 내리며, 앞으로 나아가기를 끝날 때까지 계속 반복하는 거예요.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/jiki-treadmill.webp"
  alt="러닝머신 위에서 계속 달리고 있는 Jiki, 그저 계속해서 나아가고 있는 모습"
  width="428"
  height="400"
/>

방법은 아주 간단해요. `repeat` 키워드에 숫자를 주지 않으면 돼요. 괄호를 그냥 비워 두는 거죠. 이렇게 하면 Jiki는 무언가가 멈추라고 할 때까지 계속 나아가요. 나중에 그 '무언가'가 무엇인지 살펴볼 거예요. 하지만 지금은 연습 문제가 끝날 때까지, 아니면 Jiki가 정말 오래 움직여서 이제 그만 쉬고 싶다고 판단할 때까지 계속 나아갈 거예요.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/jiki-treadmill-exhausted.webp"
  alt="오랜 시간 달린 후 러닝머신 위에 지쳐 쓰러진 Jiki, 포기하고 쉬고 싶어 하는 모습"
  width="500"
  height="378"
/>
