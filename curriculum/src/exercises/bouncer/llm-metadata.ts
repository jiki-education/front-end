import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches basic if statements (conditionals). Students use askAge()
    to retrieve a value, then use an if statement to conditionally call letIn().
    The key concept is making a decision based on a condition (age > 20).

    The exercise has four scenarios: clearly allowed (25), clearly not allowed (18),
    and two boundary values (21 allowed, 20 not allowed).
  `,

  tasks: {
    "check-age": {
      description: `
        Students need to:
        1. Call askAge() and store the result in a variable
        2. Use an if statement to check if age > 20
        3. If yes, call letIn()

        Key functions:
        - askAge(): returns the person's age as a number
        - letIn(): lets the person in (visual animation)

        Common mistakes:
        - Using >= 20 instead of > 20 (the age-20 scenario catches this)
        - Forgetting to store the age in a variable first
        - Calling letIn() outside the if block (always letting people in)
        - Using the wrong comparison operator (< instead of >)

        Teaching strategy:
        - Focus on the if statement concept: checking a condition before acting
        - Help students understand > vs >= with the boundary scenario
        - This is their first if statement, so keep guidance simple and encouraging
      `
    }
  }
};
