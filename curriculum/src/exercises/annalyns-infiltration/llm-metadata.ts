import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    Practising combining conditions with &&, || and ! to gate which actions are taken.
  `,

  tasks: {
    "plan-the-rescue": {
      description: `
        Unlike a single multi-way if/else, every action here is its OWN independent if statement — a student
        who chains them with else if will silently skip valid actions. Two non-obvious traps the
        instructions and solution don't flag: (1) "asleep" must be expressed as !...IsAwake() because there is
        no isAsleep() function; (2) the dog route to freeing does NOT require the prisoner to be awake (only the
        archer asleep), so a student reasoning "you can't free a sleeping prisoner" will wrongly reject the
        all-asleep-with-dog case.
      `
    }
  }
};
