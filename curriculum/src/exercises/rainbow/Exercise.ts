import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class RainbowExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { rectangle, hsl } = this.getAllAvailableFunctions();
    return [rectangle, hsl];
  }
}

export default RainbowExercise;
