import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class SunsetExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { circle, rectangle, rgb_to_hex, hsl_to_hex } = this.getAllAvailableFunctions();
    return [circle, rectangle, rgb_to_hex, hsl_to_hex];
  }
}

export default SunsetExercise;
