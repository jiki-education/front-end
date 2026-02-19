import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches 24-hour to 12-hour time conversion using if/else if conditionals.
    Students learn to use conditional logic to determine AM/PM and convert hours,
    handling edge cases like midnight (0 -> 12am) and noon (12 -> 12pm).
    Key concepts: conditionals, variable mutation, comparison operators.
  `,

  tasks: {
    "display-time": {
      description: `
        Students need to:
        1. Call currentTimeHour() and currentTimeMinute() to get the time
        2. Determine "am" or "pm" based on whether hour >= 12
        3. Convert the hour: midnight (0) becomes 12, hours > 12 subtract 12
        4. Call displayTime(hour, minutes, indicator)

        Common mistakes:
        - Using > 12 instead of >= 12 for the AM/PM check (noon shows as "am")
        - Forgetting the midnight case (hour 0 should display as 12)
        - Using a single if/else instead of separate checks for AM/PM and hour conversion
        - Putting the hour conversion inside the AM/PM if block

        Teaching strategy:
        - Help students think about the two separate problems: determining am/pm and converting the hour
        - Walk through edge cases: midnight (0:00), noon (12:00), 1am (1:00), 1pm (13:00)
        - The if/else if pattern for hour conversion is the key learning moment
      `
    }
  }
};
