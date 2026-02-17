import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

export const llmMetadata: {
  description: string;
  tasks: Record<TaskId, { description: string }>;
} = {
  description:
    "The student must use num_flowers() to get the flower count, calculate the gap using 100 / (count + 1), then plant flowers evenly spaced using a repeat loop. This exercise teaches using function return values in arithmetic expressions.",
  tasks: {
    "plant-flowers-evenly": {
      description:
        "Store the result of num_flowers() in a variable. Calculate the gap as 100 / (count + 1). Set position to gap, then use repeat count times to plant at position and increment by gap each iteration. The key concept is using a function's return value in a calculation."
    }
  }
};
