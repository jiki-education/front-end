---
title: "문자열 연결"
description: "고정된 텍스트와 변수를 `+`로 이어서 하나의 긴 문자열로 만드는 방법."
en_md5: 0e6c7a941a1fb1161445da27a4d7e818
---

문자열이 무엇인지 이미 알고 있을 거예요. 문자열은 텍스트가 적힌 종이 조각이에요.

지금까지 사용한 문자열은 모두 직접 타이핑한 것이었어요. 그런데 변수나 조건에 따라 문자열을 만들어야 한다면 어떻게 할까요? 어떻게 해야 할까요?

두 가지 방법이 있어요.

첫 번째 방법은 문자열 연결(영어: _string concatenation_)이라고 해요. 이건 두 문자열을 합친다는 뜻을 있어 보이게, 약간 헷갈리게 표현한 말이에요.

두 단어 `"hello"`(안녕하세요)와 `"world"`(세계)가 있다고 상상해 봐요. 이걸로 `"hello world"`라는 문자열을 만들고 싶어요.

그냥 `"hello world"`라고 하나의 문자열로 적어도 되지만, `"hello " + "world"`라고 적어도 똑같은 문자열이 나와요.

물론 이 상황에서는 별로 유용하지 않아요. 하지만 누군가의 이름이 들어 있는 변수가 있고, 그 사람에게 인사를 하고 싶다면 어떨까요?

`name`(이름)이라는 변수가 있고, 여기에는 어떤 때는 `"Jeremy"`(제레미)가, 다른 때는 `"Jiki"`가 들어 있다고 상상해 봐요. 이 변수를 이용해서 `"hello Jeremy"`나 `"hello Jiki"`라고 말하고 싶은 거예요.

<img
  class="concept-image"
  src="/static/images/concept-assets/string-concatenation/jiki-name-box.webp"
  alt="Jiki가 이름(name)이라고 적힌 상자를 들고 있어요. 상자에는 다양한 값이 들어갈 수 있어요."
  width="207"
  height="400"
/>

자, 이걸 연결 개념으로 해결할 수 있어요:

```javascript
"hello " + name // "hello Jeremy" or "hello Jiki"
```

그러면 `name` 상자 안에 무엇이 들어 있느냐에 따라 `"hello Jeremy"`, `"hello Jiki"` 또는 다른 누구에게든 인사를 할 수 있어요.
