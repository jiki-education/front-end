---
title: "구름, 비 & 태양"
description: "구름, 비, 햇살이 있는 날씨 장면을 만들어 보세요."
en_md5: a06cdbeb8b648c6ced759401f0133e81
---

이번 연습 문제에서는 해가 구름 뒤로 살짝 보이는 비 오는 날의 날씨 아이콘을 그리는 것이 과제예요. 완성하면 다음과 같은 모습이에요:

<img src="/static/images/exercise-assets/cloud-rain-sun/finished.webp" alt="완성된 구름, 비, 태양 장면" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.3); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

연습하기 쉽도록 미리 틀을 그려 뒀고, 구름의 아랫부분도 코드에 추가해 뒀어요. **이 줄은 변경할 수 없어요** (회색으로 비활성화되어 있고 옆에 자물쇠 기호가 표시돼 있어 바로 알 수 있어요).

`circle`(원)과 `ellipse`(타원) 함수가 필요해요. 빗방울에는 `ellipse`만 사용해야 해요. 해나 구름에 `ellipse`를 사용하면 제대로 동작하지 않아요.

필요한 거의 모든 숫자는 5로 나누어 떨어져요 (예: 5, 10, 15 등). 유일한 예외는 빗방울의 가로 반지름인데, `3`이에요.

재미있게 해봐요!
