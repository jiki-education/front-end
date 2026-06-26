import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class CheckerboardExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { rectangle, circle } = this.getAllAvailableFunctions();
    return [rectangle, circle];
  }
}

export default CheckerboardExercise;
