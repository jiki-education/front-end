import WordleExercise from "../../exercise-categories/wordle/WordleExercise";
import metadata from "./metadata.json";

export default class WordleSolverExercise extends WordleExercise {
  protected get slug() {
    return metadata.slug;
  }

  public availableFunctions = [
    {
      name: "guess",
      func: this.guessWord.bind(this),
      descriptionKey: "describers.guess"
    },
    {
      name: "common_words",
      func: this.getCommonWords.bind(this),
      descriptionKey: "describers.commonWords"
    }
  ];
}
