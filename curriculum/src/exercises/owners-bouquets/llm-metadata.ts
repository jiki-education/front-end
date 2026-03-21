import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

export const llmMetadata: {
  description: string;
  tasks: Record<TaskId, { description: string }>;
} = {
  description:
    "This is the student's first exercise with scenarios — the same code must pass multiple test cases where askNumberOfFlowers() returns different values (1, 3, 4, 9). The student must store the return value in a variable, calculate even spacing using 100 / (count + 1), then use a repeat loop to plant flowers. Key concepts: function return values used in arithmetic, variables that track changing state across loop iterations, and writing generalized code that handles multiple scenarios.",
  tasks: {
    "plant-flowers-evenly": {
      description:
        "Store the result of askNumberOfFlowers() in a variable (e.g. let count = askNumberOfFlowers()). Calculate the gap as 100 / (count + 1). Set a position variable to gap, then use repeat(count) to plant at position and increment position by gap each iteration. Common mistakes: hardcoding 9 flowers (works for one scenario but not others), forgetting to increment position inside the loop, using 100/count instead of 100/(count+1) which places flowers at the edges."
    }
  }
};
