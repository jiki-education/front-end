import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    Two routes are equally valid here and the instructions deliberately say so, so never
    steer a student off the one they've picked. The provided solution shows the split
    route; the manual route walks the name character by character, building each word up
    and pushing it when a space arrives.

    Anchor steps (manual route):
    1. Start with an empty array and an empty current-word string.
    2. On a space: push the current word if it isn't empty, then reset it.
    3. On any other character: add it to the current word.
    4. After the loop: push the final word if it isn't empty.

    Anchor steps (split route):
    1. Split the name on a space to get the pieces.
    2. Start with an empty array.
    3. Push each piece onto it, but only if the piece isn't empty.

    Diagnosing the next broken sub-step: an empty string in the array means the
    non-empty guard is missing (manual step 2, split step 3), which is the double-space
    scenario. A missing final word is manual step 4, and can't happen on the split
    route, so it also tells you which route they took.
  `,

  tasks: {
    "sign-words": {
      description: `
        Non-obvious traps to watch for:
        - Three of the four scenarios pass without any empty-piece guard, so a student
          can feel finished while the double-space scenario alone fails. Point them at
          that scenario's input rather than at their code.
        - On the manual route the missing-final-word bug is invisible in the two-word
          scenario if they also have the guard wrong, because the two bugs can mask
          each other. Check both ends of their loop.
      `
    }
  }
};
