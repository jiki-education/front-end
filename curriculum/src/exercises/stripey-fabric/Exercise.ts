import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class StripeyFabricExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { rectangle } = this.getAllAvailableFunctions();
    return [rectangle];
  }
}

export default StripeyFabricExercise;
