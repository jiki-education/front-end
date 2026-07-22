import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore their first if statement: acting on a value only when a
    condition holds. It is an early exercise, so keep guidance simple and encouraging.
  `,

  tasks: {
    "check-age": {
      description: `
        The main trap is the boundary: the policy is "21 and older", so the condition must exclude exactly
        20 (e.g. age > 20, or age >= 21). The hidden age-20 scenario specifically catches an off-by-one
        like >= 20. Also watch for letIn() being called outside the if (letting everyone in).
      `
    }
  }
};
