import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    Don't hand over a finished function - find the first broken or missing sub-step and coach only that one.
    Array methods (including includes) are first unlocked by this level, so reaching for one is right. If they
    hand-roll a nested search through the guest list instead, that is a correct answer to the required
    task - affirm it rather than "correcting" it. The bonus is where the shorter route earns its keep.
  `,

  tasks: {
    "count-chancers-in-queue": {
      description: `
        Returning from inside the loop is the classic slip, carried over from earlier "is X on the list?"
        exercises where returning early was correct. The framing that helps: a bouncer working down the queue
        with a clipboard can't shout the headcount until they've reached the very back.

        The question is asymmetric, so walking the guest list rather than the queue now gives wrong answers.
        Ask what their number is counting.
      `
    },
    "solve-tightly": {
      description: `
        The line budget rules out a hand-rolled membership search. Their working code isn't wrong, it's
        just longer than the budget, so frame it as "there's a shorter route", not "that's broken". Point
        at the membership check as the part that can collapse to one expression, and let them find which
        method does it.
      `
    }
  }
};
