---
title: "함수 입력"
description: "함수를 실행할 때마다 동작을 달리하기 위해 함수의 투입구에 값을 넣는 방법"
en_md5: 0bd82377f2407de5fe030511752d5503
---

기계, 즉 함수의 더 강력한 면 중 하나는, 많은 함수에 정보를 넣으면 실행할 때 하는 일이 달라진다는 거예요.

지금까지 우리는 상자처럼 생긴 기계를 봤어요, `move`(이동) 같은 거예요.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/move-machine.webp"
  alt="투입구가 없는 평범한 상자 모양의 move 기계"
  width="322"
  height="400"
/>

하지만 어떤 기계는 투입구가 있어요, 이 `walk`(걷기) 기계처럼요. `walk` 기계는 `move` 기계와 거의 같아요. 캐릭터(영어: _character_)를 앞으로 이동시키는데, Jiki가 그 투입구를 이용해서 캐릭터가 몇 걸음 앞으로 걸을지 지정할 수 있어요. 그래서 `move` 함수를 세 번 연속으로 쓰는 대신, `move`, `move`, `move` 대신, 이제는 `walk` 함수를 쓰고 Jiki에게 숫자 3을 기계에 넣으라고 말하면 되는 거예요.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/walk-machine-slot.webp"
  alt="걸음 수를 입력할 투입구가 위에 달린 walk 기계"
  width="481"
  height="400"
/>

코드로는 함수 이름을 쓰고, 지금처럼 `walk`라고 쓰고 여는 괄호를 써요. 그리고 괄호를 닫기 전에 입력(영어: _input_)으로 어떤 값을 줄지 적어요. 지금은 입력을 3으로 주고 싶어서 `walk`가 세 걸음 앞으로 가라고 말하는 거예요:

```javascript
walk(3)
```

Jiki가 그걸 보면 숫자 3을 가져와서, 그 숫자를 작은 동전처럼 여겨 기계의 투입구에 넣은 후, 손잡이를 돌려 전원을 켜요.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/jiki-coin-into-slot.webp"
  alt="Jiki가 동전처럼 숫자 3을 walk 기계의 투입구에 넣고 손잡이를 돌리는 모습"
  width="421"
  height="400"
/>

사각형과 원을 그리는 함수에서는, Jiki에게 여러 개의 숫자를 넣으라고 말해야 해요. 왼쪽에서 얼마나 떨어져야 하는지, 위에서 얼마나 떨어져야 하는지, 사각형의 너비와 높이 같은 걸 지정해야 하죠.

Jiki의 세계에서는 그게 각각 다른 투입구일 뿐이에요, 각 숫자마다 하나씩.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/two-machines-inputs.webp"
  alt="사각형 기계에는 left, top, width, height를 위한 슬롯이 있고, 원 기계에는 cx, cy, radius를 위한 슬롯이 있어요"
  width="396"
  height="400"
/>

그래서 코드에서는 각 숫자를 쓰고 그 사이에 쉼표를 넣으면 돼요. 함수 이름, 괄호, 각 입력에 해당하는 숫자들을 쉼표로 구분해 쓰고, 마지막에 괄호를 닫아요:

```javascript
rectangle(10, 20, 30, 40)
```

함수를 잘못된 개수의 입력으로 사용하려 하면 오류가 발생해요. 예를 들어, 투입구가 없는 기계에 입력을 하나 넣으려고 하면 Jiki가 안 된다고 알려줄 거예요. 또한 투입구가 있는 기계를 사용할 때 무엇을 넣을지 말하지 않으면, Jiki도 멈추고 불평할 거예요. 조금 반항적인 기분이 들면 한번 시도해 보고 어떤 일이 일어나는지 확인해 보세요. 앞으로 더 복잡해지면서 이런 실수를 많이 하게 될 거예요. 스트레스받거나 속상해하지 마세요. 우리 모두 실수하면서 배워요. 뇌가 진짜로 무언가를 체화하는 가장 빠른 길이 실수라는 말도 있잖아요. 그리고 모두가 이런 실수를 해요. 우리 모두 처음에는 아무것도 몰랐으니까, 스트레스받지 마요.

한 가지 더 언급할 점이 있어요: 연습 문제에서 가끔 슬래시 두 개, `//`로 시작하는 줄을 보게 될 거예요. 이걸 주석(영어: _comments_)이라고 해요. 주석은 여러분만을 위한 비공개 메모로, Jiki는 완전히 무시해요. 그래서 Jiki가 `//`로 시작하는 줄을 만나면 그냥 건너뛰고 다음 줄로 넘어가요. 주석을 이용하면 스스로에게 메모를 남길 수 있어요. 작동 방식을 상기시키는 데 아주 유용하죠. 종종 여러분을 위해 주석이 미리 적혀 있기도 해요. 연습 문제를 시작할 때 어디에 코드를 써야 한다거나 어떻게 해결할지 힌트를 줄 수 있어요. 물론 여러분 자신의 주석도 자유롭게 추가해도 돼요.

연습 문제 지시 사항의 하단에는 사용할 수 있는 함수에 대한 정보가 나와요. 어떤 입력을 넣어야 하는지 정확히 알려줘요.
