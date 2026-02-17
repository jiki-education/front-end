import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise is a drawing project where students build a house using variables.
    It encourages relational thinking — deriving positions from base variables so
    changing house_left/house_top moves the entire house.
    Key concepts: variable relationships, arithmetic for positioning, structured thinking.
  `,

  tasks: {
    "draw-house": {
      description: `
        Students draw a house from scratch using variables. Only color variables
        are provided in the stub — students must define all positions and sizes.

        House specifications:
        - Sky: rectangle(0, 0, 100, 100) in sky blue
        - Grass: rectangle(0, 80, 100, 20) in green
        - Frame: rectangle(20, 50, 60, 40) in orange
        - Roof: triangle(16, 50, 50, 30, 84, 50) in brown
        - Left window: rectangle(30, 55, 12, 13) in white
        - Right window: rectangle(58, 55, 12, 13) in white
        - Door: rectangle(43, 72, 14, 18) in brown
        - Door knob: circle(55, 81, 1) in gold

        Key teaching points:
        1. Students should define base variables (house_left, house_top) first
        2. All other positions should derive from these using arithmetic
        3. If done right, changing house_left moves the whole house
        4. This is the culmination of the variables level

        Relational formulas:
        - roof_left = house_left - roof_overhang
        - roof_right = house_left + house_width + roof_overhang
        - roof_peak_x = house_left + house_width / 2
        - window1_left = house_left + window_inset (10)
        - window2_left = house_left + house_width - window_inset - window_width
        - door_left = house_left + (house_width - door_width) / 2
        - door_top = house_top + house_height - door_height
        - knob_x = door_left + door_width - knob_radius - 1
        - knob_y = door_top + door_height / 2

        Common mistakes:
        - Hardcoding all positions instead of using formulas
        - Getting the roof triangle points wrong
        - Forgetting the door is at the bottom of the house frame
        - Mixing up x/y for the door knob
      `
    }
  }
};
