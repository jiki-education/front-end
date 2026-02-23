import GolfExercise from "../../exercise-categories/golf/GolfExercise";
import metadata from "./metadata.json";

export default class GolfRollingBallStateExercise extends GolfExercise {
  protected get slug() {
    return metadata.slug;
  }

  public availableFunctions = [
    {
      name: "roll_to",
      func: this.rollTo.bind(this),
      description: "rolled the ball to position ${arg1}",
      arity: 1 as const
    }
  ];
}
