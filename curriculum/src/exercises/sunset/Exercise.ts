import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class SunsetExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { circle, rectangle, rgb, hsl } = this.getAllAvailableFunctions();
    return [circle, rectangle, rgb, hsl];
  }
}

export default SunsetExercise;
