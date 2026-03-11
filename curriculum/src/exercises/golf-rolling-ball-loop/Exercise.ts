import GolfExercise from "../../exercise-categories/golf/GolfExercise";
import metadata from "./metadata.json";

export default class GolfRollingBallLoopExercise extends GolfExercise {
  protected get slug() {
    return metadata.slug;
  }

  public availableFunctions = [
    {
      name: "roll",
      func: this.rollRight.bind(this),
      description: "rolled the ball one step to the right"
    }
  ];
}
