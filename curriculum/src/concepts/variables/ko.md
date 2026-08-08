---
title: "변수 만들고 사용하기"
description: "Jiki의 선반에 있는 상자들로, 값을 이름과 함께 저장해서 나중에 코드에서 다시 꺼내 쓸 수 있어요."
en_md5: dd0834017a8d42c22cca25966c1fdd91
---

변수(영어: _variables_)는 정보를 저장할 수 있게 해줘요. 코딩을 하다 보면 어떤 숫자나 문자열을 나중에 쓰려고 저장해야 할 때가 많아요. 그럴 때 변수를 사용해요. 자, Jiki의 작업실을 조금 뒤로 물러서서 바라볼까요? 그러면 선반이 또 하나 더 있는 게 보여요. 우리는 이미 첫 번째 선반에 `move`나 `rectangle` 같은 작은 기계들, 즉 함수가 올려져 있는 걸 알고 있어요. 그런데 이 두 번째 선반에는 기계 대신 상자가 아주 많아요. 이 상자들이 바로 변수예요. Jiki에게 이 상자 안에 무엇이든 넣어 두라고 지시할 수 있고, 나중에 다시 꺼내 달라고 할 수도 있어요. 각 상자에는 함수와 똑같이 이름이 붙어 있고, 각 상자에는 딱 하나의 값만 들어 있어요. 지금은 숫자나 문자열이에요. 하지만 강의가 진행되면 더 복잡한 것도 저장하는 방법을 배워요.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/two-shelves.webp"
  alt="Jiki의 작업실에 있는 두 개의 선반: 하나는 함수라고 적혀 있고 기계들이 놓여 있으며, 다른 하나는 변수라고 적혀 있고 상자들이 놓여 있어요."
  width="500"
  height="173"
/>

그럼 Jiki에게 어떻게 상자를 만들고 그 안에 뭔가를 넣으라고 할까요? `let`(새 상자를 만드는 예약어) 키워드를 사용해요. `let` 키워드는 Jiki에게 새 상자를 만들어야 한다고 알려줘요. Jiki가 포장지를 뜯어서 상자를 조립하고, `let` 다음에 오는 단어를 보면서 그게 상자에 붙일 이름표라고 생각해요. 이 경우에는 `name`(이름)이에요. 그래서 Jiki는 펜을 꺼내 이름표에 `name`이라고 써요. 그런 다음 등호(영어: _equal sign_) 뒤에 오는 것을 봐요. 여기서는 제 이름 `"Jeremy"`가 와요. `"Jeremy"`는 문자열이기 때문에, Jiki는 종이 한 장을 꺼내서 거기에 `"Jeremy"`라고 적어요. 지금까지 써 온 색상들과 똑같은 문자열이에요. 그리고 그 종이를 상자 안에 넣어요.

```javascript
let name = "Jeremy"
```

<img
class="concept-image"
src="/static/images/concept-assets/variables/jeremy-paper.webp"
alt="`"Jeremy"`라고 적힌 종이를 들고 상자에 넣으려는 Jiki"
width="373"
height="400"
/>

이제 우리는 Jiki에게 상자를 만들고, 이름표를 붙이고, 그 안에 무언가를 넣으라고 지시했어요. 그러면 Jiki는 그 상자를 선반에 올려놔요. 프로그램 안 어디에서든 Jiki가 그 상자를 선반에서 가져와서 안에 뭐가 들었는지 확인할 수 있어요. 이런 머릿속 모형을 만들어 보세요. 저는 오래 코딩을 해 왔지만, 지금도 코드를 쓸 때면 뭔가를 상자에 넣어 두었다가 나중에 꺼내는 그림을 상상해요. `let` 키워드를 보면 '아, 이제 새 상자를 만드는 거구나' 하고 생각하세요.

이제 변수의 이름, 즉 상자에 붙이는 이름표에 대해 말씀드릴게요. 몇 가지 규칙이 있어요. 첫째, 변수 이름에는 띄어쓰기를 넣을 수 없어요. 상자에 붙일 이름표에 여러 단어를 쓰고 싶다면, 단어들을 붙여 쓰면서 각 단어의 첫 글자를 대문자로 바꿔요. 이걸 카멜 케이스(영어: _camel case_)라고 해요. 낙타의 혹이 각 단어의 첫 글자를 대문자로 밀어 올린다고 상상해 보세요. 예를 들어, `my name`이라는 뜻의 이름표를 붙이고 싶다면 띄어쓰기로 두 단어를 쓰는 대신 한 단어로 붙이면서 `N`을 대문자로 만들어 `myName`이라고 써요.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/duplicate-names-confused.webp"
  alt="둘 다 `name`이라고 쓰인 이름표가 붙은 상자를 보고 어리둥절해하는 Jiki"
  width="485"
  height="400"
/>

자, 그럼 이 값들을 위한 변수를 만들어 볼게요. 태양의 왼쪽 위치부터 시작해요. `let` 키워드를 사용해서 Jiki에게 `leftPosition`(왼쪽 위치)라는 새 상자를 만들라고 지시해요. 대문자 `P`가 들어간 카멜 케이스를 눈여겨보세요. 그리고 상자에 어떤 숫자를 넣을지 알려줘요. Jiki는 그 상자를 선반에 올려놓고, 이번에는 `topPosition`(위쪽 위치), `radius`, `color`에도 똑같이 해요.

```javascript
let leftPosition = 10
let topPosition = 20
let radius = 5
let color = "yellow"

circle(leftPosition, topPosition, radius, color)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/name-on-shelf.webp"
  alt="변수 선반에 놓인 이름표가 붙은 상자들, 각각 하나의 값을 담고 있어서 나중에 Jiki가 꺼내 쓸 수 있어요."
  width="500"
  height="378"
/>

코드 안에서 언제든지 이 변수들을 다시 참조할 수 있고, Jiki는 상자에서 값(영어: _values_)을 꺼내 기계에 넣어요. 변수의 또 다른 좋은 점은, 같은 위치에 뭔가를 그릴 때마다 그 `leftPosition`과 `topPosition` 변수를 다시 쓸 수 있다는 거예요. 다른 예를 들어 볼게요. 벽돌 30개로 벽을 쌓는다고 가정해 봐요. 모든 벽돌의 너비와 높이가 같아야 한다면, 코드 맨 앞에서 너비와 높이에 대한 변수를 만들어 두고 코드 전체에서 그 변수를 참조하는 게 훨씬 좋아요. 왜냐하면 나중에 너비나 높이를 바꾸고 싶을 때 한 곳만 바꾸면 나머지 전체가 알아서 갱신되기 때문이에요.
