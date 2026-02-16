import GolfExercise from "../../exercise-categories/golf/GolfExercise";
import metadata from "./metadata.json";

export default class GolfRollingBallLoopExercise extends GolfExercise {
  protected get slug() {
    return metadata.slug;
  }

  public availableFunctions = [
    {
      name: "move_ball_right",
      func: this.moveBallRight.bind(this),
      description: "moved the ball one unit to the right"
    }
  ];
}
