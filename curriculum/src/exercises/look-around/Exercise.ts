import MazeExercise from "../../exercise-categories/maze/MazeExercise";
import { type ExecutionContext, type ExternalFunction, type Shared, isString } from "@jiki/interpreters";
import metadata from "./metadata.json";

type Direction = "up" | "right" | "down" | "left";

const CELL_NAMES: Record<number, string> = {
  0: "empty",
  1: "wall",
  2: "start",
  3: "target",
  4: "fire",
  5: "poop"
};

export default class LookAroundExercise extends MazeExercise {
  protected get slug() {
    return metadata.slug;
  }

  availableFunctions: ExternalFunction[] = [
    {
      name: "move",
      func: this.moveAndCheck.bind(this),
      description: "Move the character forward one cell"
    },
    {
      name: "turn_left",
      func: this.turnLeft.bind(this),
      description: "Turn the character 90 degrees left"
    },
    {
      name: "turn_right",
      func: this.turnRight.bind(this),
      description: "Turn the character 90 degrees right"
    },
    {
      name: "look",
      func: this.look.bind(this),
      description: "Look in a direction and see what's there"
    }
  ];

  private moveAndCheck(executionCtx: ExecutionContext) {
    let newRow = this.characterRow;
    let newCol = this.characterCol;

    switch (this.direction) {
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

    if (newRow >= 0 && newRow < this.grid.length && newCol >= 0 && newCol < this.grid[0].length) {
      const cellValue = this.grid[newRow][newCol];
      if (cellValue === 4) {
        executionCtx.logicError("You walked into fire!");
        return;
      }
      if (cellValue === 5) {
        executionCtx.logicError("You stepped in poop!");
        return;
      }
    }

    this.move(executionCtx);

    if (this.grid[this.characterRow]?.[this.characterCol] === 3) {
      executionCtx.exerciseFinished();
    }
  }

  private getAbsoluteDirection(relativeDir: string): Direction {
    const leftDirections: Direction[] = ["down", "right", "up", "left"];
    const rightDirections: Direction[] = ["down", "left", "up", "right"];
    const currentDir = this.direction as Direction;

    if (relativeDir === "ahead") {
      return currentDir;
    }

    if (relativeDir === "left") {
      const currentIndex = leftDirections.indexOf(currentDir);
      return leftDirections[(currentIndex + 1) % 4];
    }

    // "right"
    const currentIndex = rightDirections.indexOf(currentDir);
    return rightDirections[(currentIndex + 1) % 4];
  }

  look(_executionCtx: ExecutionContext, directionArg: Shared.JikiObject): string {
    if (!isString(directionArg)) {
      _executionCtx.logicError('look() expects a string direction: "left", "right", or "ahead"');
      return "wall";
    }

    const relativeDir = directionArg.value as string;
    if (!["left", "right", "ahead"].includes(relativeDir)) {
      _executionCtx.logicError('look() direction must be "left", "right", or "ahead"');
      return "wall";
    }

    const absoluteDir = this.getAbsoluteDirection(relativeDir);
    let newRow = this.characterRow;
    let newCol = this.characterCol;

    switch (absoluteDir) {
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
      return "wall";
    }

    const cellValue = this.grid[newRow][newCol];
    if (typeof cellValue === "string") return cellValue;
    return CELL_NAMES[cellValue] ?? "wall";
  }
}
