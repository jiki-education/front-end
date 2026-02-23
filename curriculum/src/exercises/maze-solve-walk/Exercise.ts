import MazeExercise from "../../exercise-categories/maze/MazeExercise";
import { type ExecutionContext, type ExternalFunction, type Shared, isNumber } from "@jiki/interpreters";
import metadata from "./metadata.json";

export default class MazeSolveWalkExercise extends MazeExercise {
  protected get slug() {
    return metadata.slug;
  }

  availableFunctions: ExternalFunction[] = [
    {
      name: "walk",
      func: this.walk.bind(this),
      description: "Walk forward a given number of steps",
      arity: 1
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
    }
  ];

  walk(executionCtx: ExecutionContext, steps: Shared.JikiObject) {
    if (!isNumber(steps)) {
      executionCtx.logicError("walk() expects a number of steps");
      return;
    }

    const numSteps = steps.value as number;
    for (let i = 0; i < numSteps; i++) {
      this.move(executionCtx);
    }
  }
}
