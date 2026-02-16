import GolfExercise from "../../exercise-categories/golf/GolfExercise";
import metadata from "./metadata.json";

export default class GolfRollingBallStateExercise extends GolfExercise {
  protected get slug() {
    return metadata.slug;
  }

  public availableFunctions = [
    {
      name: "move_ball_to",
      func: this.moveBallTo.bind(this),
      description: "moved the ball to position ${arg1}"
    }
  ];
}
