import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise combines list iteration with drawing functions. Students receive
    a list of weather elements and must draw the corresponding scene. It builds on
    Part 1 (which mapped descriptions to lists) and the cloud-rain-sun exercise
    (which taught the drawing primitives). Key concepts: iterating lists, conditional
    logic based on list contents, defining and using helper functions.
  `,

  tasks: {
    "draw-weather": {
      description: `
        Students define a draw_weather(elements) function that takes a list like
        ["sun", "cloud", "rain"] and draws the corresponding weather scene.

        Key teaching points:
        1. Iterating through a list to process each element
        2. Conditional logic: checking if "cloud" is in the list to determine sun size
        3. Organizing code with helper functions (draw_sky, draw_sun, draw_cloud, etc.)
        4. Combining previously learned drawing skills with list processing

        The sun size logic:
        - Large sun: circle(50, 50, 25) when there's no cloud
        - Small sun: circle(75, 30, 15) when there's also a cloud

        Common mistakes:
        - Forgetting to draw the sky background first
        - Not checking for "cloud" before drawing the sun (always drawing same size)
        - Drawing rain/snow when they're not in the elements list
        - Getting the coordinates wrong for snow (circles, not ellipses)
      `
    }
  }
};
