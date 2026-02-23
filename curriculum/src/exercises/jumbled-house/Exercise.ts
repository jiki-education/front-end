import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class JumbledHouseExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { rectangle, circle, triangle, ellipse } = this.getAllAvailableFunctions();
    return [rectangle, circle, triangle, ellipse];
  }
}

export default JumbledHouseExercise;
