import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore navigating a nested dictionary, finding a maximum
    by a tracked value, and doing string/number transformations to format output.

    The instructions deliberately tell the student to "explore the data" rather than handing over
    its shape, so the non-obvious context to draw out (not give away wholesale) is: the fetch
    response is a nested dictionary, the answers live under a "response" then "answers" path as a
    list of dictionaries with string "text"/"certainty" keys, and the time lives under a "meta"
    then "time" path as a string like "500ms". Certainty arrives as a decimal string (0.78 -> 78%)
    and time as milliseconds (500ms -> 0.5s), both needing conversion to strings for the output.
  `,

  tasks: {
    "format-llm-response": {
      description: `
        The student writes askLlm to fetch, pick the highest-certainty answer, do the conversions,
        and concatenate the result string. A natural sub-skill is a helper that pulls the numeric
        prefix off the time string by reading characters until a non-digit. Note: the student does
        not see these steps broken down.
      `
    }
  }
};
