import MazeExercise from "../../exercise-categories/maze/MazeExercise";
import { type ExecutionContext, type Shared, isNumber } from "@jiki/interpreters";
import type { AvailableFunction } from "../../types";
import metadata from "./metadata.json";

export default class MazeSolveWalkExercise extends MazeExercise {
  protected get slug() {
    return metadata.slug;
  }

  availableFunctions: AvailableFunction[] = [
    {
      name: "walk",
      func: this.walk.bind(this),
      descriptionKey: "describers.walk",
      arity: 1
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
    }
  ];

  walk(executionCtx: ExecutionContext, steps: Shared.JikiObject) {
    if (!isNumber(steps)) {
      executionCtx.logicError(this.t("errors.walkExpectsNumber"));
      return;
    }

    const numSteps = steps.value as number;
    for (let i = 0; i < numSteps; i++) {
      this.move(executionCtx);
    }
  }
}
