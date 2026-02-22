import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches functions that return values. Students use getShotLength()
    to retrieve a value, then use it to control a loop and a conditional.
    The key concept is storing a return value in a variable and using it.

    The exercise has four scenarios: too short, too long, and the two boundary
    values of the valid range (56-65).
  `,

  tasks: {
    "check-shot": {
      description: `
        Students need to:
        1. Call getShotLength() and store the result in a variable
        2. Track x and y positions, starting at x=29, y=75
        3. Use a loop (shotLength + 1 times) to roll the ball right
        4. Check if shotLength >= 56 and shotLength <= 65
        5. If yes, roll ball down 9 times (updating y)
        6. Fire fireworks at the end

        Key functions:
        - rollTo(x, y): rolls the ball to position (x, y)
        - getShotLength(): returns the shot length
        - fireFireworks(): fires celebratory fireworks

        Common mistakes:
        - Forgetting to store the shot length in a variable
        - Using the wrong range for the hole check
        - Not combining conditions with 'and'
        - Forgetting to update x or y before calling rollTo
        - Off-by-one errors in the loop count

        Teaching strategy:
        - Focus on the return value concept: getShotLength() gives you a number
        - Start with getting and using the shot length for horizontal movement
        - Then add the conditional check for the hole range
      `
    }
  }
};
