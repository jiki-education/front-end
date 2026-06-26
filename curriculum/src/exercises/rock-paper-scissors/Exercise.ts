import RockPaperScissorsExercise from "../../exercise-categories/rock-paper-scissors/RockPaperScissorsExercise";
import metadata from "./metadata.json";

export default class RockPaperScissorsDetermineWinnerExercise extends RockPaperScissorsExercise {
  protected get slug() {
    return metadata.slug;
  }
}
