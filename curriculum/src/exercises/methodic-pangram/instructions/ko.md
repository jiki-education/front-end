---
title: "메서드 Pangram"
description: "Pangram을 업데이트하여 내장된 문자열 메서드를 사용하도록 하세요."
en_md5: 61b73caa0318f68e9a0facca189e7abf
---

세 번째 Pangram 연습 문제에 오신 걸 환영해요! 여기서는 지금까지 만든 모든 도우미 함수를 가져와서 훨씬 간단하게 만들어 볼 거예요.

제가 만들라고 권했던 함수들(`includes`, `indexOf`, `toLowerCase`)은 사실 문자열에 내장된 메서드예요.

그래서 `includes("Jeremy", "r")`라고 쓰는 대신 `"Jeremy".includes("r")`라고 써도 똑같이 동작해요. 하지만 이 메서드는 문자열에 내장되어 있기 때문에, 직접 만들지 않아도 돼요.

이번 문제에서는 그중 두 가지만 필요해요:

- `"Jeremy".toLowerCase()`
- `"Jeremy".includes("r")`

이제 `indexOf`는 더 이상 필요하지 않아요. 원래 `indexOf`는 `toLowerCase`를 만들기 위해 썼지만, 이제 내장된 `toLowerCase`가 그 일을 대신해 줘요.

그러니까 직접 작성한 함수들은 모두 지우고 (그래도 이제 이 메서드들이 내부적으로 어떻게 동작하는지 알게 됐으니, 저한테 너무 화내지는 말아 주세요!), 그 대신 이 메서드들을 사용하면 돼요.

재미있게 해봐요!
