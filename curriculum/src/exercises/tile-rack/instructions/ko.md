---
title: "타일 랙"
description: "타일 랙에서 글자가 정확히 어디에 있는지 찾아보세요."
en_md5: 156e18323706fc278f7a887f421c01f3
---

자동 스크래블 봇을 만들고 있어요. 봇은 문자열로 표현된 타일 랙(예: `"AERHBT"`)을 가지고 있어요. 봇이 어떤 글자를 놓을지 결정하면, 타일을 집기 위해 손을 어느 위치(영어: _position_)로 움직여야 할지 알아야 해요.

`findTile`(타일을 찾는 함수)이라는 함수를 작성하세요. 이 함수는 랙(문자열)과 찾을 글자를 받아요. 타일이 있으면 `"Move to position X"`를 반환해요. 여기서 X는 첫 번째로 일치하는 타일의 위치(1부터 시작)예요. 타일이 랙에 없으면 `"Error: Tile not on rack"`를 반환해요.

결과 문자열을 만들려면, 위치 번호를 문자열로 변환하고, 연결(`+`) 또는 템플릿 문자열을 사용해 부분들을 합쳐야 해요.

예시:

- `findTile("ABCDE", "A")`는 `"Move to position 1"`을 반환해요
- `findTile("ABCDE", "C")`는 `"Move to position 3"`을 반환해요
- `findTile("BANANA", "A")`는 `"Move to position 2"`를 반환해요 (첫 번째 A)
- `findTile("ABCDE", "Z")`는 `"Error: Tile not on rack"`을 반환해요
