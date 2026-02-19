import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise revisits the traffic lights from earlier, now requiring all
    positions and sizes to be derived from a single radius variable using multiplication.
    Key concepts: scaling with multiplication, consistent spacing, relative positioning.
  `,

  tasks: {
    "build-relational-traffic-lights": {
      description: `
        Students derive all positions and sizes as multiples of radius.

        Fixed variables:
        - red = "#FF0000", yellow = "#FFFF00", green = "#00FF00"
        - housingColor = "#222222"
        - radius = 10

        Derived variables (all multiples of radius):
        - centerX = radius * 5 = 50
        - redY = radius * 3 = 30
        - yellowY = radius * 5 = 50
        - greenY = radius * 7 = 70
        - housingX = radius * 3 = 30
        - housingY = radius = 10
        - housingWidth = radius * 4 = 40
        - housingHeight = radius * 8 = 80

        Key teaching points:
        1. All dimensions scale proportionally from one variable
        2. Multiplication for consistent spacing (lights are 2*radius apart)
        3. The housing padding is derived from radius too
        4. Changing radius rescales the entire traffic light

        Common mistakes:
        - Hardcoding values instead of using radius * n
        - Getting the housing position wrong (it starts at radius*3, not centerX - radius*2)
        - Incorrect spacing between lights
      `
    }
  }
};
