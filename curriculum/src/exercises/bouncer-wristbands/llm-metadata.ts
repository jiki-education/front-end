import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches if/else if/else chains. Students use getAge()
    to retrieve a value, then use a chain of conditions to call the correct
    wristband function based on age ranges.

    The exercise has six scenarios: one clear case per age group (child, teen,
    adult, senior) plus two boundary values (13 and 65).
  `,

  tasks: {
    "assign-wristband": {
      description: `
        Students need to:
        1. Call getAge() and store the result in a variable
        2. Use if/else if/else to check age ranges in order
        3. Call the correct wristband function for each range

        Age ranges:
        - Under 13: childWristband()
        - 13 to 17: teenWristband()
        - 18 to 64: adultWristband()
        - 65 and over: seniorWristband()

        Key functions:
        - getAge(): returns the person's age as a number
        - childWristband(), teenWristband(), adultWristband(), seniorWristband()

        Common mistakes:
        - Using <= 13 instead of < 13 (the boundary-13 scenario catches this)
        - Using <= 65 instead of < 65 (the boundary-65 scenario catches this)
        - Not using else if — writing separate if statements instead of a chain
        - Getting the order wrong (checking adult before teen)
        - Forgetting the else block for seniors

        Teaching strategy:
        - Build on the simple if from the bouncer exercise
        - Explain that else if lets you check multiple conditions in sequence
        - Emphasize that order matters — once a condition is true, the rest are skipped
        - The else at the end catches everything that didn't match earlier conditions
      `
    }
  }
};
