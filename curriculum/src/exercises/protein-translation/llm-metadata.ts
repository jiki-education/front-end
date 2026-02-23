import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches dictionary usage, string chunking, and early termination.
    Students learn to use dictionaries for mapping values, process strings in fixed-size
    chunks, and implement stop conditions in loops.

    Key concepts:
    - Dictionary/object creation and lookup
    - String iteration with index tracking
    - Modulo operator for grouping (every 3rd character)
    - Break statement for early loop termination
    - Function decomposition (splitting into helper functions)
  `,

  tasks: {
    "basic-translations": {
      description: `
        Students need to:
        1. Create a dictionary mapping codons to amino acids
        2. Understand that each codon is exactly 3 characters
        3. Use dictionary bracket notation to look up proteins

        Common mistakes:
        - Misspelling codon keys or protein values
        - Not handling the empty string case (should return empty list)
        - Forgetting that dictionary keys are case-sensitive

        Teaching strategy:
        - Start with the codon-to-protein mapping dictionary
        - Test with single codons first before handling multiple
        - The dictionary is straightforward but requires attention to spelling
      `
    },
    "multiple-codons": {
      description: `
        Students need to:
        1. Split the RNA string into 3-character chunks
        2. Use the modulo operator to detect every 3rd character
        3. Build up each codon character by character
        4. Create a list of codons, then translate each

        Common mistakes:
        - Off-by-one errors when using modulo
        - Not resetting the codon string after adding to list

        Teaching strategy:
        - Recommend writing a separate rnaToCodons function
        - Walk through the logic: accumulate 3 chars, add to list, reset
        - Use a counter variable to track position in the string
        - Modulo 3 == 0 means we've completed a codon
      `
    },
    "stop-codon-behavior": {
      description: `
        Students need to:
        1. Check if a codon maps to "STOP" in the dictionary
        2. Use the 'break' statement to exit the loop early
        3. Not add "STOP" to the protein list

        Common mistakes:
        - Adding "STOP" to the protein list before breaking
        - Forgetting to break (continuing to translate after STOP)
        - Checking for "STOP" string instead of checking the mapped value

        Teaching strategy:
        - Order matters: check for STOP before adding to list
        - The break statement immediately exits the nearest loop
        - Emphasize that proteins after a STOP codon are ignored
      `
    }
  }
};
