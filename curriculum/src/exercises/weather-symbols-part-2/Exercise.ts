import { DrawExercise } from "../../exercise-categories/draw";
import metadata from "./metadata.json";

export class WeatherSymbolsPart2Exercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  public get availableFunctions() {
    const { rectangle, circle, ellipse } = this.getAllAvailableFunctions();
    return [rectangle, circle, ellipse];
  }
}

export default WeatherSymbolsPart2Exercise;
