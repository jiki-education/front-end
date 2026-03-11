import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class FoxyFaceExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { triangle } = this.getAllAvailableFunctions();
    return [triangle];
  }

  public setupBackground(imageUrl: string) {
    this.canvas.style.backgroundImage = `url(${imageUrl})`;
    this.canvas.style.backgroundSize = "cover";
    this.canvas.style.backgroundPosition = "center";
  }
}

export default FoxyFaceExercise;
