---
title: "스카이라인"
description: "무작위 건물로 도시의 스카이라인을 완성하세요."
en_md5: cb89a31566f55397d19e1375dbac44cc
---

마천루 연습 문제에서는 높이가 서로 다른 마천루 하나를 만들었어요. 이번에는 한 걸음 더 나아가서, 높이도 다르고 너비도 다른 건물들로 스카이라인을 만들어 볼게요.

`numBuildings()`(건물 수)라는 함수가 있어요. 이 함수는 시나리오에서 만들어야 할 건물 수를 알려줘요. 그리고 `randomWidth()`(무작위 너비)와 `randomNumFloors()`(무작위 층수) 함수도 있어요. 이 함수들을 사용해서 시나리오에 나오는 각 건물의 너비와 층수를 정하면 돼요. 함수를 처음 호출하면 첫 번째 건물의 값이 나오고, 그다음 호출하면 다음 건물의 값이 차례대로 나와요.

건물들은 왼쪽에 `1` 열만큼의 간격을 두고 시작하고, 건물 사이에도 `1` 열 간격이 있어요.

예를 들어 `numBuildings()`가 `2`를, `randomWidth()`가 차례대로 `5`와 `7`을, `randomNumFloors()`가 `4`와 `8`을 반환하는 시나리오라면, 아래와 같은 배치가 나와요 (여기서 `xxxxx`는 콘크리트 바닥이에요).

```
       WWWWWWW
       WGGGGGW
       WGGGGGW
       WGGGGGW
 WWWWW WGGGGGW
 WGGGW WGGGGGW
 WGGGW WGGGGGW
 WGGGW WGGGGGW
 WGEGW WGGEGGW
xxxxxxxxxxxxxxxxxxxxxxx
```
