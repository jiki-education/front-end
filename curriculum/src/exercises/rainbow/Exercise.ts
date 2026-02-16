import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class RainbowExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { rectangle, hsl_to_hex } = this.getAllAvailableFunctions();
    return [rectangle, hsl_to_hex];
  }
}

export default RainbowExercise;
