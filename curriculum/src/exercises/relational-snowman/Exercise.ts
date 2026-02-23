import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class RelationalSnowmanExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { rectangle, circle } = this.getAllAvailableFunctions();
    return [rectangle, circle];
  }

  public setupBackground(imageUrl: string) {
    this.canvas.style.backgroundImage = `url(${imageUrl})`;
    this.canvas.style.backgroundSize = "cover";
    this.canvas.style.backgroundPosition = "center";
  }
}

export default RelationalSnowmanExercise;
