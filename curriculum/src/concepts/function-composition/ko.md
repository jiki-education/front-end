---
title: "여러 함수를 함께 사용하기"
description: "문제를 작은 단일 책임 함수로 나누어 서로 호출하게 하여 각각을 단순하고 재사용 가능하게 만드는 방법"
en_md5: 7df3110b30c0f279d7f04d3b4e331a99
---

지금까지 함수를 작성할 때, 각 함수는 대체로 스스로 동작하며 필요한 모든 로직을 담고 있었어요.

이제는 함수를 잘게 나누어, 여러 가지 일을 하는 큰 함수 대신 서로 협력하는 작은 함수들을 만들어 볼 거예요.

프로그래밍의 일반적인 원칙으로, 각 함수는 가능한 한 최소한의 일만 해야 해요. 이를 보고 함수가 단일 책임(영어: _single responsibility_)을 가진다고 해요. 각 함수는 한 가지 일만 하고, 그 일의 하위 부분들은 다른 함수를 사용해 처리해야 해요.

그럼 예시를 하나 살펴볼게요.

이름을 설명하는 문자열을 반환하는 함수가 있다고 상상해 봐요.

간단한 버전은 이렇게 생겼어요. 이미 작성해 본 적 있는 카운팅 루프를 사용하고, 그 결과를 이어 붙이는 문자열 템플릿을 사용해요.

```javascript
function describeName(name) {
  let length = 0
  for (const letter in name) {
    length += 1
  }
  return `This name is ${length} letters long`
}
```

이 코드는 잘 동작하지만, 두 가지 일을 하고 있어요. 하나는 꽤 일반적인 일인 카운팅이고, 다른 하나는 특정 형식으로 이 문자열을 만드는 아주 구체적인 일이에요.

이걸 두 개의 함수로 나누면 훨씬 좋아져요. 하나는 카운팅을 맡고, 다른 하나는 이 특정 형식으로 이름을 설명하는 일을 맡는 거예요.

```javascript
// Just counts letters
function countLetters(str) {
  let count = 0
  for (const letter in str) {
    count += 1
  }
  return count
}

// Just formats text nicely
function describeName(name) {
  const count = countLetters(name)
  return `The name has ${count} letters`
}
```

그리고 그 일반적인 카운팅 함수를 이 문자열 서식 지정뿐만 아니라 필요한 다른 곳에서도 재사용할 수 있어요. 문자열에서 글자 수를 셀 필요가 있을 때마다, 출력과 관련된 어떤 것과도 완전히 분리되어 있어요.

두 함수를 각각 따로 읽어도 각각이 무엇을 하는지 바로 이해할 수 있어요.

함수가 점점 복잡해지고 개수가 많아질수록, 이 기법이 깔끔하고 읽기 쉬운 코드와 완전한 혼란과 엉망진창의 차이를 만들어요.

여기서 다시 한번 언급할 가치가 있는 점이 있어요. 함수 안에서 만든 것은 의도적으로 반환하지 않는 한 다른 함수에서 접근할 수 없다는 거예요.

그래서 `count`(개수) 변수를 `describeName`(이름 설명) 함수 안에서 참조하려고 해도, 그 변수는 다른 함수에 속해 있기 때문에 할 수 없어요.

<img
  class="concept-image"
  src="/static/images/concept-assets/function-composition/jiki-thinking.webp"
  alt="Jiki가 머리 위에 전구를 켜고, 변수가 각 함수에 비공개로 유지되는지 생각하는 모습"
  width="361"
  height="353"
/>

JavaScript에서는 모든 것 위의 최상단에 함수들이 공유할 수 있는 변수를 만들 수 있지만, 정말 타당한 이유가 없다면 그렇게 하지 않는 걸 강력히 추천해요.

각 함수를 더 독립적으로 유지할수록, 이를 순수(영어: _pure_) 함수라고 부르는데, 코드가 더 깔끔해지고 버그도 훨씬 적게 생겨요.
