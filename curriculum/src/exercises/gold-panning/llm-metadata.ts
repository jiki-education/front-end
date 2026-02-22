import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches using a function return value inside a loop with an accumulator.
    Students call pan() five times in a repeat loop, adding each result to a running total,
    then sell the total. This combines return values with the loop + variable updating
    pattern from previous levels.
  `,

  tasks: {
    "pan-and-sell": {
      description: `
        Students need to:
        1. Create a variable initialized to 0 to track total nuggets
        2. Use a repeat(5) loop
        3. Inside the loop, add the return value of pan() to the total
        4. After the loop, call sell() with the total

        Common mistakes:
        - Forgetting to initialize the nuggets variable to 0
        - Calling pan() without adding the result to the total
        - Calling sell() inside the loop instead of after it
        - Not using a loop (calling pan() 5 separate times works but misses the lesson)

        Teaching strategy:
        - Show the accumulator pattern: variable starts at 0, grows each iteration
        - Emphasize that pan() gives back a value that must be captured
        - The loop ties together return values with state updating from previous levels
      `
    }
  }
};
