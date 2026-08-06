---
title: "타일 검색"
description: "타일 랙에서 특정 문자를 찾아보세요."
en_md5: bbbc77ef2c270fd4228d6a20e690a095
---

스크래블 봇을 만들고 있어요. 봇이 단어를 놓기 전에, 자신의 랙에 특정 문자 타일이 있는지 확인해야 해요.

랙은 문자들의 문자열(예: `"SCRAB"`)로 나타내요.

다음 두 개의 매개변수를 받는 `contains`(포함) 함수를 작성하세요:

- `haystack`(찾을 대상): 타일 랙을 나타내는 문자열
- `needle`(찾을 문자): 찾으려는 문자

문자가 랙에 있으면 `true`를, 없으면 `false`를 반환하세요.

예시:

- `contains("SCRAB", "A")`는 `true`를 반환해요.
- `contains("SCRAB", "Z")`는 `false`를 반환해요.
- `contains("", "A")`는 `false`를 반환해요.
