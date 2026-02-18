import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches list building through character-by-character string processing.
    Students learn to iterate over a string, build words using concatenation, and collect
    them into a list using push(). It reinforces for-each loops, conditionals, and the
    pattern of accumulating results in a list. Similar to word-count but without dictionaries.
  `,

  tasks: {
    "extract-words": {
      description: `
        Students need to:
        1. Create an empty list and an empty string to build each word
        2. Iterate through each character of the sentence
        3. On spaces: push the current word (if non-empty) to the list and reset the word
        4. On periods: skip them entirely
        5. On other characters: concatenate them onto the current word
        6. After the loop: push the final word if non-empty

        Common mistakes:
        - Forgetting to push the last word after the loop ends
        - Not checking if the word is empty before pushing (creating empty strings in the list)
        - Including periods as part of words
        - Using push() without reassigning (in Jiki, push returns a new list)

        Key stdlib functions: push() to add words to the list, concatenate() to build words character by character.
      `
    }
  }
};
