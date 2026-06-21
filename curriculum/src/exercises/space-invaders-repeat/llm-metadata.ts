import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore the repeat loop by spotting that the same move/shoot sequence repeats for each column of aliens. The 7-line limit forces a loop rather than writing out every call.
  `,

  tasks: {
    "repeat-shoot": {
      description: `
        Identify the repeating per-column action (move into position, then shoot each row) and the number of columns, then wrap it in a single repeat.

        Common mistakes:
        - Writing out individual calls and hitting the line limit
        - Wrong repeat count
        - Wrong order in the body (shooting before moving onto an alien column)

        Teaching strategy: have them describe the alien pattern in words first, then ask what they do for each group. Note the laser starts at a position with no aliens above it.
      `
    }
  }
};
