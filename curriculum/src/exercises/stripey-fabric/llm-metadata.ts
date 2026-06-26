import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    First real use of the remainder (%) and logical-or (||) operators: 20 stripes whose
    colour is a function of their number.
  `,

  tasks: {
    "weave-the-fabric": {
      description: `
        Single task = the whole exercise.

        The one non-obvious trap is ordering, and it bites twice. The if/else-if chain must
        check the end rule (i === 1 || i === 20 -> purple) AND the multiple-of-4 rule
        (i % 4 === 0 -> green) BEFORE the even rule (i % 2 === 0 -> blue). Stripe 20 is even
        but must be purple; stripes 4/8/12/16 are even but must be green. A student who
        checks the even rule first will silently get those wrong, and the stripey output
        makes it look "nearly right", so steer them to the rule order rather than the colours.
      `
    }
  }
};
