import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class RainbowBallExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { circle, hsl } = this.getAllAvailableFunctions();
    return [circle, hsl];
  }
}

export default RainbowBallExercise;
