import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches students to implement sensing functions for maze navigation.
    Instead of having canTurnLeft(), canTurnRight(), and canMove() provided, students must
    write these functions themselves using look(direction), which returns what's in a given direction.
    Key concepts: writing functions with return values, using a helper function to avoid repetition,
    and understanding relative vs absolute directions.
  `,

  tasks: {
    "straight-path": {
      description: `
        Students implement canMove() using look("ahead").
        The function should return true if the space ahead is safe (not "fire", "wall", or "poop").
        Common mistake: only checking for "wall" and forgetting about "fire" and "poop".
      `
    },
    "turn-left": {
      description: `
        Students implement canTurnLeft() using look("left").
        Same logic as canMove() but checks the left direction.
        Encourage creating a shared helper function rather than duplicating the check logic.
      `
    },
    "turn-right": {
      description: `
        Students implement canTurnRight() using look("right").
        By now they should see the pattern and create a checkDirection(direction) helper.
        The forks scenario tests that left turns are prioritized over right turns.
      `
    },
    "turn-around": {
      description: `
        All three sensing functions should already work. The existing turn_around function
        and loop code handle dead ends. This task tests the complete algorithm on complex mazes
        including ones with fire, poop, and backtracking.
        Common mistake: forgetting that turn_around is already provided in the starter code.
      `
    },
    "bonus-challenges": {
      description: `
        Challenge 1: Use look() only once in the entire program (via a checkDirection helper).
        Challenge 2: Solve with only 13 added lines. Both require a clean helper function approach:
        one checkDirection(direction) that calls look(), and three one-line functions that delegate to it.
      `
    }
  }
};
