import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches API data processing using dictionaries.
    Students learn to chain multiple API calls, process nested data structures,
    and format results into human-readable strings.
    Key concepts: fetch function, dictionary access, nested data, error handling, string formatting.
  `,

  tasks: {
    "format-response": {
      description: `
        Students need to:
        1. Build a URL by concatenating the base URL with the username
        2. Call fetch(url, {}) to get user data
        3. Check for errors using hasKey() on the response
        4. Loop through items to extract artist API URLs from nested dictionaries
        5. Fetch each artist URL to get the artist name
        6. Format all names into a sentence with commas and ", and " before the last name

        Common mistakes:
        - Forgetting to pass an empty dictionary {} as the second argument to fetch()
        - Not checking for errors before processing items
        - Accessing nested dictionary keys incorrectly (need item["urls"]["spotify_api"])
        - Getting the sentence formatting wrong (commas vs "and")
        - Forgetting the exclamation mark at the end

        The helper functions (length, toSentence, hasKey) can be defined by the student
        or the stdlib hasKey can be used directly.
      `
    }
  }
};
