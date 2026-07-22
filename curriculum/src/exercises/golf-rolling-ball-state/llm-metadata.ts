export const llmMetadata = {
  description: `
    This exercise lets a student combine a loop with a tracked state variable. Unlike
    the earlier relative roll(), moveTo(position) is absolute, so a smooth animation
    requires stepping a position variable up one at a time and moving to it each time.

    Anchor steps:
    1. Initialise a position variable to the start (28).
    2. In a loop, increment the position by 1.
    3. Call moveTo(position) each iteration so the ball animates to 88.
  `,
  tasks: {
    "roll-ball": {
      description: `
        Non-obvious traps to watch for:
        - moveTo is absolute, so a single moveTo(88) teleports without animating; the
          loop must step the variable so the ball appears to roll.
        - The increment count and start value must line up so the final position lands on 88.
      `
    }
  }
};
