import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise is a drawing project where students build a house using variables.
    It encourages relational thinking: deriving every position and size from just two
    anchor variables (houseWidth and houseHeight) so the whole house resizes while
    staying centered horizontally and planted on the grass.
    Key concepts: variable relationships, arithmetic for positioning, structured thinking.

    Important: correctness is checked by re-running the student's code with different
    houseWidth/houseHeight values injected (isolated checks). A house that looks right at
    the default values but uses hardcoded numbers will still fail, because it won't scale.
    Guide students towards deriving everything from the anchors, never towards hardcoding.
  `,

  tasks: {
    "draw-house": {
      description: `
        Students draw a house using variables. The colors, canvasWidth (100), and the two
        anchor variables (houseWidth, houseHeight) are provided in the stub. The anchor
        declarations are locked, but their values stay editable so students can experiment.
        Students must derive everything else from the two anchors plus the fixed facts.

        Fixed facts (from the instructions):
        - Canvas is 100 x 100. The house is always centered horizontally (centerX = 50).
        - Grass is full width at the bottom with a height of 15 (so grassTop = 85).
        - The bottom of the house sits 5 below the top of the grass (houseBottom = 90), and
          the house grows upward from there (houseTop = houseBottom - houseHeight).

        Proportions (each a fraction of the frame's width or height):
        - Roof: overhang = houseWidth/10, height = houseHeight/2, peak centered, base on the
          top of the frame.
        - Windows: width = houseWidth/5, height = houseHeight/3, inset from each side =
          houseWidth/7, top = houseHeight/8 below the top of the frame.
        - Door: width = houseWidth/5, height = houseHeight/2, centered horizontally, bottom on
          the bottom of the house.
        - Door knob: radius = doorWidth/10. There is a gap of doorWidth/10 between the knob and
          the door's right edge. That puts the center doorWidth/5 in from the right edge. The
          knob is vertically centered in the door.

        Relational formulas:
        - centerX = canvasWidth / 2
        - houseLeft = centerX - houseWidth / 2
        - houseBottom = grassTop + 5
        - houseTop = houseBottom - houseHeight
        - roofLeft = houseLeft - houseWidth / 10
        - roofRight = houseLeft + houseWidth + houseWidth / 10
        - roofPeakX = centerX
        - roofPeakY = houseTop - houseHeight / 2
        - window1Left = houseLeft + houseWidth / 7
        - window2Left = houseLeft + houseWidth - houseWidth / 7 - houseWidth / 5
        - windowTop = houseTop + houseHeight / 8
        - doorLeft = centerX - doorWidth / 2
        - doorTop = houseBottom - doorHeight
        - knobRadius = doorWidth / 10
        - knobOffset = doorWidth / 10
        - knobX = doorLeft + doorWidth - knobRadius - knobOffset
        - knobY = doorTop + doorHeight / 2

        At the default (houseWidth=60, houseHeight=40) this gives frame (20,50,60,40), roof
        (14,50,50,30,86,50), and door (44,70,12,20). The knob center is at (53.6,80) with
        radius 1.2. Several window and knob coordinates are deliberately non-integer and that
        is fine.

        Key teaching points:
        1. Only houseWidth and houseHeight are the anchors. Build everything else from them.
        2. Centering keys off centerX. The vertical layout keys off houseBottom on the grass.
        3. Every fraction in the instructions maps to a division (e.g. "1/5th" -> / 5)
        4. This is the culmination of the variables level

        Common mistakes:
        - Hardcoding positions/sizes instead of deriving them (passes the default, fails scaling)
        - Anchoring the house to a fixed top instead of growing up from houseBottom
        - Forgetting to recenter when the width changes
        - Getting the roof triangle points wrong
      `
    }
  }
};
