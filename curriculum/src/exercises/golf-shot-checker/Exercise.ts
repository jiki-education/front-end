import GolfExercise from "../../exercise-categories/golf/GolfExercise";
import metadata from "./metadata.json";

export default class GolfShotCheckerExercise extends GolfExercise {
  protected get slug() {
    return metadata.slug;
  }

  public availableFunctions = [
    {
      name: "move_ball_right",
      func: this.moveBallRight.bind(this),
      description: "moved the ball one unit to the right"
    },
    {
      name: "move_ball_down",
      func: this.moveBallDown.bind(this),
      description: "moved the ball one unit down"
    },
    {
      name: "get_shot_length",
      func: this.getShotLength.bind(this),
      description: "retrieved the shot length"
    },
    {
      name: "fire_fireworks",
      func: this.fireFireworks.bind(this),
      description: "fired off celebratory fireworks"
    }
  ];
}
