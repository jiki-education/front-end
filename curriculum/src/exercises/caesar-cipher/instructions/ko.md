---
title: "시저 암호"
description: "고대 로마의 암호로 비밀 메시지를 암호화하기"
en_md5: 029bbd7050127405f5e67a3a20353139
---

시저 암호는 가장 오래되고 간단한 암호화 기법 중 하나예요. 율리우스 카이사르가 장군들에게 비밀 메시지를 보내기 위해 사용했어요.

이 암호는 메시지의 각 글자를 알파벳에서 일정한 수만큼 이동시키는 방식이에요. 예를 들어, 이동 값이 3이면 'a'는 'd'가 되고, 'b'는 'e'가 되는 식이에요. 이동 값이 'z'를 넘어가면 알파벳의 처음으로 돌아가요.

공백은 이동하지 않고 그대로 공백으로 둬요.

`encode(message, shift)`(소문자 메시지와 이동 값을 받아 암호화된 메시지를 반환하는 함수)라는 함수를 만드세요.

예시:

- `encode("abc", 1)`은 `"bcd"`를 반환해요
- `encode("xyz", 3)`은 `"abc"`를 반환해요 (끝을 넘어가면 처음으로 돌아가요)
- `encode("hello world", 5)`은 `"mjqqt btwqi"`를 반환해요

힌트: 이 문제를 더 작은 보조 함수들로 나누어 보세요!

### 재미있는 사실

한때 포르투갈의 브라가에서 열린 기술 컨퍼런스의 진행을 맡은 적이 있어요. 무대에 오르기 5분 전, 주최측이 찾아와서는 브라가의 로마 유산을 기념하기 위해 그날 첫 부분을 율리우스 카이사르 분장을 하고 진행해도 괜찮겠냐고 조금 쑥스러워하며 물어봤어요. 과연 잘 해냈을까요...?

<img
  src="/static/images/exercise-assets/caesar-cipher/jeremy-as-caesar.webp"
  alt="시저로 분장한 Jeremy"
  style="width: 100%; max-width: 300px; border: 5px solid var(--color-purple-500); padding: 4px; border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;"
/>
