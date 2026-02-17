import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class RainbowSplodgesExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { circle, hsl_to_hex } = this.getAllAvailableFunctions();
    return [circle, hsl_to_hex];
  }
}

export default RainbowSplodgesExercise;
