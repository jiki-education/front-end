---
title: "체커판"
description: "어떤 크기로든 체커판을 그리고, 판의 크기로부터 모든 위치를 계산해 게임을 준비해요."
en_md5: 1669c45c882ce94e16651bfc2d77a172
---

이 프로젝트에서는 체커(드라프트라고도 해요) 게임을 할 수 있도록 체커판을 그리고 그 위에 말을 배치해요.

코드는 **어떤 크기의 판**에서도 동작해야 해요. 여러분이 실험해 볼 수 있도록 세 개의 판을 준비했어요. 하나는 고전적인 8x8 판, 다른 하나는 더 작은 6x6 판, 또 다른 하나는 더 큰 10x10 판이에요. `getBoardSize()`(체커판의 크기를 반환하는 함수)를 사용하면 이번 판이 가로와 세로로 각각 몇 칸인지 알 수 있어요(판은 항상 정사각형이에요).

<div style="display: flex; gap: 8px; margin: 12px 0;">
  <img src="/static/images/exercise-assets/checkerboard/board-6.svg" alt="6x6 체커판" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
  <img src="/static/images/exercise-assets/checkerboard/board-8.svg" alt="8x8 체커판" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
  <img src="/static/images/exercise-assets/checkerboard/board-10.svg" alt="10x10 체커판" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
</div>

### 체커판

평소처럼 캔버스의 가로와 세로는 `100`이에요. 다음 두 가지 규칙을 따르세요:

- 판의 가장자리에는 너비 `2`인 `"black"` 테두리를 둘러요.
- 칸은 `"dark brown"`과 `"white"`가 번갈아 나타나도록 그려요. 판 안쪽 공간을 깔끔하게 나누어 채워야 해요. 왼쪽 아래 칸은 항상 `"dark brown"`이에요.

### 말

- 각 말은 칸의 가운데에 놓여요.
- 말은 테두리가 있는 원으로, 바깥 테두리와 안쪽 색상이 있어요:
  - 말 전체의 너비는 칸 너비의 80%예요.
  - 안쪽 원의 너비는 말 전체 너비의 75%예요.
- 보드의 **위쪽** 행에는 `"charcoal"` 말을 놓아요(각 말은 `"black"` 테두리를 가져요).
- 보드의 **아래쪽** 행에는 `"white"` 말을 놓아요(각 말은 `"grey"` 테두리를 가져요).
- 말은 항상 **어두운 칸** 위에만 놓여요.
- **가운데 두 행**은 항상 비워 둬요. 나머지 모든 행에는 말을 놓아요.

## 판의 크기로부터 유도하기

이 연습 문제의 핵심은 크기와 위치를 절대 하드코딩하지 않는 거예요. 판의 크기로부터 하나의 '칸' 크기를 계산한 다음, 그 값으로 모든 칸과 모든 말을 만들어요. 제대로 하면 숫자를 하나도 바꾸지 않고 똑같은 코드로 작은 6x6 체커판과 큰 10x10 체커판을 모두 그릴 수 있어요.
