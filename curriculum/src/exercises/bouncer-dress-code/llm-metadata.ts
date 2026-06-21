import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore combining conditions with || and running multiple actions
    inside a single branch. It builds on the if/else if/else chain from bouncer-wristbands.
  `,

  tasks: {
    "check-dress-code": {
      description: `
        The classic trap here is writing outfit === "ballgown" || "tuxedo" instead of
        outfit === "ballgown" || outfit === "tuxedo" (each side of || needs its own full comparison).
        Also note the fancy branch runs TWO actions (offerChampagne() and letIn()), and "anything else"
        is the else branch (turnAway()).
      `
    }
  }
};
