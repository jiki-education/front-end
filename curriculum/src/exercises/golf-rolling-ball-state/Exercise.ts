import { type ExecutionContext, type Shared, isNumber } from "@jiki/interpreters";
import GolfExercise from "../../exercise-categories/golf/GolfExercise";
import metadata from "./metadata.json";
import type { AvailableFunction } from "../../types";

export default class GolfRollingBallStateExercise extends GolfExercise {
  protected get slug() {
    return metadata.slug;
  }

  public availableFunctions: AvailableFunction[] = [
    {
      name: "move_to",
      func: this.moveTo.bind(this),
      descriptionKey: "describers.moveTo",
      arity: 1 as const
    }
  ];

  moveTo(executionCtx: ExecutionContext, position: Shared.JikiObject) {
    if (!isNumber(position)) {
      return executionCtx.logicError(this.t("errors.positionNotNumber"));
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
