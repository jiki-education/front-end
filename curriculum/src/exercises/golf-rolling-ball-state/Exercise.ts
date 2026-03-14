import { type ExecutionContext, type ExternalFunction, type Shared, isNumber } from "@jiki/interpreters";
import GolfExercise from "../../exercise-categories/golf/GolfExercise";
import metadata from "./metadata.json";

export default class GolfRollingBallStateExercise extends GolfExercise {
  protected get slug() {
    return metadata.slug;
  }

  public visitedPositions: number[] = [];

  public availableFunctions: ExternalFunction[] = [
    {
      name: "move_to",
      func: this.moveTo.bind(this),
      description: "moved the ball to position ${arg1}",
      arity: 1 as const
    }
  ];

  moveTo(executionCtx: ExecutionContext, position: Shared.JikiObject) {
    if (!isNumber(position)) {
      return executionCtx.logicError("position must be a number");
    }
    this.ballX = position.value;
    this.visitedPositions.push(this.ballX);
    this.addAnimation({
      targets: `#${this.view.id} .ball`,
      offset: executionCtx.getCurrentTimeInMs(),
      duration: 1,
      transformations: {
        left: `${this.ballX}%`
      }
    });
    executionCtx.fastForward(20);
  }
}
