import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore the search-a-collection pattern: loop, return
    early on a match, return a default at the end. It is often a student's first time combining
    a loop with conditional logic, so the early-return idea is the main thing to land.
  `,

  tasks: {
    "check-guest-list": {
      description: `
        The student loops the guest list and returns true on a match, false after the loop.

        The defining mistake is returning false inside the loop (on the first non-match) instead
        of after it, which reports everyone after the first name as absent. The framing that helps:
        you can only say "not on the list" once you've checked everyone, but "on the list" the
        moment you find them.
      `
    }
  }
};
