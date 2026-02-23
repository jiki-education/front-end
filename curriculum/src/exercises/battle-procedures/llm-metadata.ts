import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches students to extract reusable logic into a named function.
    It builds on the scroll-and-shoot exercise from the previous level — students
    already know the algorithm for moving back and forth and shooting aliens. Now they
    extract the shooting check into a shootIfAlienAbove() function.

    Key concepts: function declaration, code organization, extracting repeated patterns
    into named functions.
  `,

  tasks: {
    "battle-procedures": {
      description: `
        Students need to:
        1. Create a shootIfAlienAbove() function that checks isAlienAbove() and calls shoot() if true
        2. Use that function inside the loop
        3. Implement the same movement/direction logic from scroll-and-shoot inline

        Common mistakes:
        - Forgetting to define the function before the loop
        - Putting variable access inside the function when the function can't access outer variables
        - Forgetting the movement and direction logic

        Teaching strategy:
        - Remind students they already solved the full problem in scroll-and-shoot
        - The new concept is just extracting the shooting check into a function
        - The function only needs to call other functions, not access variables
        - Point out how shootIfAlienAbove() reads like plain English
      `
    }
  }
};
