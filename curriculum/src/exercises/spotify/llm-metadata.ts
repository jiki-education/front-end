import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student practise chaining API calls, navigating nested
    dictionaries, and formatting results into a human-readable sentence.
  `,

  tasks: {
    "format-response": {
      description: `
        Common mistakes:
        - Forgetting the empty dictionary {} as the second argument to fetch()
        - Processing items before checking the response for an "error" key
        - Mis-navigating the nesting: the artist URL is at item["urls"]["spotify_api"]
        - Sentence formatting: commas between, ", and " before the last name, trailing "!"

        The helper functions (length, toSentence, hasKey) can be written by the student
        or the stdlib hasKey used directly.
      `
    }
  }
};
