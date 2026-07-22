import { DrawExercise } from "../../exercise-categories/draw";
import type { ExecutionContext } from "@jiki/interpreters";
import metadata from "./metadata.json";

export class CheckerboardExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  private boardSize = 8;

  public setupBoardSize(n: number) {
    this.boardSize = n;
  }

  public getBoardSize(_executionCtx: ExecutionContext): number {
    return this.boardSize;
  }

  public get availableFunctions() {
    const { rectangle, circle } = this.getAllAvailableFunctions();
    return [
      rectangle,
      circle,
      {
        name: "get_board_size",
        func: this.getBoardSize.bind(this),
        descriptionKey: "describers.getBoardSize"
      }
    ];
  }
}

export default CheckerboardExercise;
