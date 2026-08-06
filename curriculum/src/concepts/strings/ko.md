---
title: "문자열"
description: "따옴표로 감싼 텍스트 조각(글자 하나, 단어, 문장, 또는 전체 단락)으로, Jiki가 종이에 적는 것입니다."
en_md5: 89b04f3849f9388a46734924f35c913c
---

숫자를 사용하고 싶을 때는, 그냥 숫자를 적으면 Jiki가 무슨 뜻인지 알아요. 그런데 글자 하나나 단어, 문장을 사용하고 싶다면 어떨까요? 예를 들어, `rectangle`(직사각형) 기계나 `circle`(원) 기계에 색깔을 지정하는 입력이 하나 더 있다고 해볼까요? 그 색깔을 기계에 넣으려면 어떻게 적어야 할까요? 만약 그냥 `green`(녹색)이나 `blue`(파란색)라고 적으면, Jiki는 선반에 있는 기계를 가리키는 줄 알고 "`green`이라는 기계는 없어요. 뭘 해야 할지 모르겠어요."라고 말할 거예요.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-confused.webp"
  alt="직사각형 기계 옆에 서서 머리 위에 물음표가 떠 있는, 혼란스러워하는 Jiki"
  width="446"
  height="400"
/>

그래서 규칙이 하나 있어요. 텍스트를 사용해야 할 때는, 텍스트를 따옴표, 큰따옴표 안에 넣어야 해요. 그리고 이렇게 따옴표 안에 무언가를 넣으면, Jiki가 종이 한 장을 꺼내서 따옴표 안에 적은 내용을 그 종이에 적어요. 우리는 이 종이들을 문자열(영어: _strings_)이라고 불러요.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/jiki-writing-green.webp"
  alt="Jiki가 종이에 green이라고 적고, 그것이 문자열이 되는 모습"
  width="398"
  height="400"
/>

문자열은 글자 하나, 단어, 문장, 단락, 심지어 책까지 될 수 있어요. 규칙은 간단해요. 텍스트라면 따옴표 안에 넣고, 그러면 문자열이 돼요.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/string-examples.webp"
  alt="칠판에 따옴표로 감싼 여러 길이의 문자열이 적혀 있어요: 글자 하나, 단어 하나, 문장, 여러 줄에 걸친 주소"
  width="500"
  height="398"
/>

그러니까 파란색 직사각형을 그리고 싶다면, 왼쪽 위치, 위쪽 위치, 너비, 높이에 해당하는 숫자를 적어요. 그런데 다섯 번째 입력에는 따옴표로 감싼 `"blue"`를 적어요.

```javascript
rectangle(10, 20, 30, 40, "blue")
```

Jiki가 선반에서 기계를 꺼내서, 앞의 네 개 투입구에 동전을 넣어요. 그리고 종이에 blue라고 적은 다음, 그 종이를 다섯 번째 투입구에 넣고 기계를 작동시켜요.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-blue-slot.webp"
  alt="직사각형 기계의 앞 네 투입구에 10, 20, 30, 40 동전이 들어 있고, Jiki가 다섯 번째 투입구에 파란색 종이를 넣고 있는 모습"
  width="500"
  height="392"
/>

문자열은 처음엔 조금 어렵게 느껴질 수 있는 기술 용어지만, 사실은 그냥 텍스트를 뜻해요. 금방 익숙해질 거예요. 전혀 대단한 게 아니에요.
