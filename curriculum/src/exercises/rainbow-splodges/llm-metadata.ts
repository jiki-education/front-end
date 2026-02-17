import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches using random numbers in a loop to create visual art.
    Students combine random_number(), circle(), and hsl_to_hex() to draw 500
    randomly positioned, randomly colored circles. Key concepts: using return
    values from functions as arguments to other functions, random number generation,
    HSL color system, and repeat loops.
  `,

  tasks: {
    "draw-splodges": {
      description: `
        Students must draw 500 circles at random positions with random colors.

        Key requirements:
        - 500 circles using a repeat loop
        - Random x position (0-100) for each circle
        - Random y position (0-100) for each circle
        - Random hue (0-360) for each circle
        - Circle radius of 3
        - Saturation 80, luminosity 50 for vibrant colors

        Key teaching points:
        1. Using return values: random_number() returns a value that gets stored in a variable
        2. Composing functions: hsl_to_hex() returns a string used as argument to circle()
        3. Each iteration should generate NEW random values (variables inside the loop)
        4. The HSL color model: hue 0-360 gives the full color spectrum

        Common mistakes:
        - Declaring variables outside the loop (same position/color every iteration)
        - Forgetting to use hsl_to_hex() to convert hue to a color string
        - Using wrong ranges for random_number()
        - Passing hue directly as color instead of converting with hsl_to_hex()

        Solution pattern:
        repeat 500 times:
          x = random_number(0, 100)
          y = random_number(0, 100)
          hue = random_number(0, 360)
          circle(x, y, 3, hsl_to_hex(hue, 80, 50))
      `
    }
  }
};
