import MazeExercise from "../../exercise-categories/maze/MazeExercise";
import metadata from "./metadata.json";

export default class MazeSolveRepeatExercise extends MazeExercise {
  protected get slug() {
    return metadata.slug;
  }
}
