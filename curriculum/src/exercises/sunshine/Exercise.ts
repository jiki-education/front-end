import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class SunshineExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { rectangle, triangle, circle } = this.getAllAvailableFunctions();
    return [rectangle, triangle, circle];
  }
}

export default SunshineExercise;
