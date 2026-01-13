import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches the importance of using variables instead of hard-coded values.
    Students refactor a house drawing to use meaningful variable names and computed values.
    Key concepts: variable naming, avoiding magic numbers, code maintainability, formula-based calculations.
  `,

  tasks: {
    "arrange-house-with-variables": {
      description: `
        Students must replace all hard-coded function arguments with variables.

        Key teaching points:
        1. Variable organization: Define all variables at the top before drawing
        2. Meaningful names: sky_color, house_left, roof_overhang, etc.
        3. Computed values: Use formulas like roof_left = house_left - roof_overhang
        4. No magic numbers: Every number in a function call should be a variable

        Variable categories to define:
        - Colors: sky_color, grass_color, house_color, roof_color, window_color, door_color, knob_color
        - Positions: sky_left, sky_top, house_left, house_top, etc.
        - Dimensions: sky_width, sky_height, house_width, house_height, etc.
        - Computed: roof_left (house_left - overhang), roof_right, roof_peak_x, etc.

        Common mistakes:
        - Forgetting to replace ALL hard-coded values
        - Manually calculating values instead of using formulas
        - Not defining variables before first use
        - Inconsistent variable naming

        Solution approach:
        1. Start by defining color variables for each element
        2. Define base position and dimension variables
        3. Calculate derived positions using formulas
        4. Replace all hard-coded function arguments with variables
        5. The code checker will fail until ALL arguments are variables
      `
    }
  }
};
