import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore using lists to track state, indexing into
    lists with a variable, and mutating list elements to reflect changes.

    The student plays Space Invaders but without isAlienAbove(). Instead they call
    getStartingAliensInRow(idx) (idx 1–3, bottom to top) to get three lists of 11 booleans
    representing alien positions. They must move the laser left/right across 11 columns,
    use their position to index into the rows, shoot the lowest alive alien in each column,
    and mark shot aliens as false. They also write helper functions: determineDirection()
    to reverse at boundaries, move() to call moveLeft()/moveRight() and update position,
    and allAliensDead() to check if every element in a row is false. Once all aliens are
    dead, they call fireFireworks() in the same loop iteration.

    To complete this exercise, the student needs to:
    1. Call getStartingAliensInRow(1), getStartingAliensInRow(2), getStartingAliensInRow(3) to get the three rows
    2. Set up direction ("right"), position (0), and a shot flag (false)
    3. Write a determineDirection(position, direction) function that reverses at boundaries 0 and 10
    4. Write a move(position, direction) function that calls moveRight()/moveLeft() and returns the new position
    5. In the repeat loop, iterate through [bottomRow, middleRow, topRow] and for each row check if shot === false && row[position] is true
    6. If so, call shoot(), set row[position] = false, and set shot = true (only shoot one alien per column per pass)
    7. Write an allAliensDead(row) function that iterates the row and returns false if any element is true
    8. After the shooting pass, check if all three rows are dead using allAliensDead()
    9. If all dead, call fireFireworks(); otherwise call determineDirection() and move()
  `,

  tasks: {
    "shoot-the-aliens": {
      description: `
        The student needs to complete steps 1-6. They need to get the alien row data,
        track position and direction, and use position to index into the rows to decide
        when to shoot. They must mark shot aliens as false. Steps 3-4 (helper functions)
        are optional at this stage — the student can inline the logic. Note: the student
        does not see these steps broken down.
      `
    },
    "fire-the-fireworks": {
      description: `
        The student has got steps 1-6 working. They now need to complete steps 7-9:
        write allAliensDead() to check if a row is fully cleared, check all three rows
        after each shooting pass, and call fireFireworks() when all aliens are dead
        (instead of moving). Note: the student does not see these steps broken down.
      `
    },
    "fireworks-inside-loop": {
      description: `
        The student has got steps 1-9 working. This bonus task asks them to ensure
        fireFireworks() is called inside the repeat loop (not after it). The reference
        solution already does this, so students who followed the natural approach will
        pass automatically. Note: the student does not see these steps broken down.
      `
    }
  }
};
