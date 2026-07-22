import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student practise relational thinking: deriving every position and
    size from just two anchor variables (houseWidth, houseHeight) so the whole house resizes
    while staying centered horizontally and planted on the grass. It is the culmination of
    the variables level.

    IMPORTANT (non-obvious): correctness is checked by silently re-running the student's code
    with DIFFERENT houseWidth/houseHeight values injected (isolated checks). A house that
    looks right at the default values but uses hardcoded numbers will still fail because it
    won't scale. Always guide students towards deriving everything from the anchors, never
    towards hardcoding numbers they worked out by hand, even when the visible canvas looks
    correct.
  `,

  tasks: {
    "draw-house": {
      description: `
        The stub locks the two anchor declarations (houseWidth, houseHeight) but leaves their
        values editable so students can experiment. Everything else must be derived from the
        anchors plus the fixed facts in the instructions.

        Common mistakes:
        - Hardcoding positions/sizes instead of deriving them (passes the default, fails scaling)
        - Anchoring the house to a fixed top instead of growing up from houseBottom on the grass
        - Forgetting to recenter when the width changes
        - Getting the roof triangle points wrong

        Several window and knob coordinates are deliberately non-integer; that is fine.
      `
    }
  }
};
