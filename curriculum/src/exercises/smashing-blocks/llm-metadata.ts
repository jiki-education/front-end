import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise builds on the Boundaried Ball exercise by adding blocks to create
    a breakout-style game. Students create 5 Block instances positioned across the
    top of the game area, then implement collision detection between the ball and
    blocks. When a collision is detected, the block is smashed (hidden) and the ball
    bounces. The game loop runs until all blocks are smashed. Key concepts: object
    creation with constructor parameters, property access and mutation, collision
    detection logic, and using break to exit an infinite loop.
  `,

  tasks: {
    "add-and-smash-blocks": {
      description: `
        Students need to:
        1. Create a Ball with \`let ball = new Ball()\`
        2. Create 5 blocks in a loop: each at top=31, left=8+((x-1)*17) for x=1..5
           - Use \`push()\` to add each block to an array
        3. Write a \`changeDirection(ball)\` function that checks all four walls
           and reverses velocity when the ball hits an edge
        4. Write a \`handleCollision(ball, blocks)\` function that:
           - Skips smashed blocks (use \`continue\`)
           - Checks horizontal alignment between ball and block
           - Detects top/bottom collision and reverses y-velocity
           - Sets \`block.smashed = true\` on collision
        5. Write an \`allBlocksSmashed(blocks)\` function that returns false
           if any block is not smashed
        6. Run a game loop that calls moveBall, changeDirection, handleCollision,
           and breaks when all blocks are smashed

        Common mistakes:
        - Forgetting to use \`ball.radius\` for boundary checks (hardcoding 3)
        - Not skipping smashed blocks in collision detection
        - Wrong block positioning formula
        - Not breaking out of the game loop when all blocks are smashed
        - Checking collision after moving instead of checking alignment correctly

        Teaching strategy:
        - Start with block creation (the loop and positioning)
        - Then reuse the wall-bouncing logic from the previous exercise
        - Add collision detection one step at a time
        - Finally add the game-over check with break
      `
    },
    "different-dimensions": {
      description: `
        This bonus task tests whether students used \`ball.radius\` and
        \`block.height\` properties instead of hardcoding values like 3 and 7.
        The ball radius changes to 4 and block height to 10. If the student
        hardcoded these values, the ball won't bounce correctly.

        Teaching strategy:
        - Point out that properties like \`ball.radius\` exist for a reason
        - Show how hardcoded values break when dimensions change
        - Encourage replacing magic numbers with property access
      `
    }
  }
};
