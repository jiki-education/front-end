import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore working with nested dictionaries,
    iterating through a list to find a maximum value, and performing data transformations
    (string-to-number conversion, unit conversion, string formatting).

    The student writes an askLlm function that takes a question string, calls
    fetch("https://myllm.com/api/v2/qanda", { "question": question }) to get LLM response data,
    and returns a formatted string like:
    "The answer to 'Who won the 1966 Football Men's World Cup?' is 'England' (100% certainty in 0.5s)."
    The fetch response is a nested dictionary with data["response"]["answers"] containing a list of
    answer dictionaries (each with "text" and "certainty" string keys), and data["meta"]["time"]
    containing a time string like "500ms". The student must select the answer with the highest
    certainty, convert certainty from a decimal string to a percentage, and convert time from
    milliseconds to seconds.

    To complete this exercise, the student needs to:
    1. Call fetch with the API URL and a dictionary containing the question parameter
    2. Extract the answers list from data["response"]["answers"] and the time string from data["meta"]["time"]
    3. Write a helper to extract the numeric prefix from the time string (e.g., "500" from "500ms") by iterating character by character and breaking on non-digits, then convert to a number and divide by 1000 for seconds
    4. Loop through the answers list, convert each answer's "certainty" string to a number, and track which answer has the highest certainty
    5. Convert the winning answer's certainty to a percentage by multiplying by 100 and converting to a string
    6. Build and return the formatted result string by concatenating all the parts together
  `,

  tasks: {
    "format-llm-response": {
      description: `
        The student needs to complete steps 1-6. Note: the student does not see these steps broken down.
      `
    }
  }
};
