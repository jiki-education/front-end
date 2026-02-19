import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore working with dictionaries by calling
    an API function and parsing the dictionary response into a formatted string.

    The student writes a getTime function that takes a city name, calls
    fetch("https://timeapi.io/api/time/current/city", { city: city }) to get time data,
    and returns a formatted string like "The time on this Monday in Amsterdam is 00:28".
    The fetch function returns a dictionary with "dayOfWeek" and "time" keys on success,
    or an "error" key on failure. If the response has an "error" key, the function should
    return the error message directly.

    To complete this exercise, the student needs to:
    1. Call fetch with the API URL and a dictionary containing the city parameter
    2. Store the response dictionary in a variable
    3. Concatenate the response fields ("dayOfWeek", "time") with the city name into the expected format
    4. Write or use a hasKey helper to check if the response contains an "error" key
    5. If an error key exists, return data["error"] instead of building the time string
  `,

  tasks: {
    "fetch-and-format-time": {
      description: `
        The student needs to complete steps 1-3. Note: the student does not see these steps broken down.
      `
    },
    "handle-errors": {
      description: `
        The student has got steps 1-3 working. They now need to complete steps 4-5. Note: the student does not see these steps broken down.
      `
    }
  }
};
