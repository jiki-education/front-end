import MazeExercise from "../../exercise-categories/maze/MazeExercise";
import metadata from "./metadata.json";

export default class MazeSolveBasicExercise extends MazeExercise {
  protected get slug() {
    return metadata.slug;
  }
}
