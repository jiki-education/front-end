import MazeExercise from "../../exercise-categories/maze/MazeExercise";
import type { ExecutionContext } from "@jiki/interpreters";
import metadata from "./metadata.json";

type Direction = "up" | "right" | "down" | "left";

export default class MazeAutomatedSolveExercise extends MazeExercise {
  protected get slug() {
    return metadata.slug;
  }

  availableFunctions = [
    {
      name: "move",
      func: this.moveAndCheck.bind(this),
      descriptionKey: "describers.move"
    },
    {
      name: "turn_left",
      func: this.turnLeft.bind(this),
      descriptionKey: "describers.turnLeft"
    },
    {
      name: "turn_right",
      func: this.turnRight.bind(this),
      descriptionKey: "describers.turnRight"
    },
    {
      name: "can_move",
      func: this.canMove.bind(this),
      descriptionKey: "describers.canMove"
    },
    {
      name: "can_turn_left",
      func: this.canTurnLeft.bind(this),
      descriptionKey: "describers.canTurnLeft"
    },
    {
      name: "can_turn_right",
      func: this.canTurnRight.bind(this),
      descriptionKey: "describers.canTurnRight"
    }
  ];

  private moveAndCheck(executionCtx: ExecutionContext) {
    this.move(executionCtx);

    if (this.grid[this.characterRow]?.[this.characterCol] === 3) {
      executionCtx.exerciseFinished();
    }
  }

  private canMoveInDirection(dir: Direction): boolean {
    let newRow = this.characterRow;
    let newCol = this.characterCol;

    switch (dir) {
      case "up":
        newRow--;
        break;
      case "down":
        newRow++;
        break;
      case "left":
        newCol--;
        break;
      case "right":
        newCol++;
        break;
    }

    if (newRow < 0 || newRow >= this.grid.length || newCol < 0 || newCol >= this.grid[0].length) {
      return false;
    }

    return this.grid[newRow][newCol] !== 1;
  }

  private getLeftDirection(): Direction {
    const directions: Direction[] = ["down", "right", "up", "left"];
    const currentIndex = directions.indexOf(this.direction as Direction);
    return directions[(currentIndex + 1) % 4];
  }

  private getRightDirection(): Direction {
    const directions: Direction[] = ["down", "left", "up", "right"];
    const currentIndex = directions.indexOf(this.direction as Direction);
    return directions[(currentIndex + 1) % 4];
  }

  canMove(_executionCtx: ExecutionContext): boolean {
    return this.canMoveInDirection(this.direction as Direction);
  }

  canTurnLeft(_executionCtx: ExecutionContext): boolean {
    return this.canMoveInDirection(this.getLeftDirection());
  }

  canTurnRight(_executionCtx: ExecutionContext): boolean {
    return this.canMoveInDirection(this.getRightDirection());
  }
}
