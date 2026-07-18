import WordleExercise from "../../exercise-categories/wordle/WordleExercise";
import metadata from "./metadata.json";

export default class WordleSolverExercise extends WordleExercise {
  protected get slug() {
    return metadata.slug;
  }

  public availableFunctions = [
    {
      name: "add_word",
      func: this.addWord.bind(this),
      descriptionKey: "describers.addWord"
    },
    {
      name: "get_target_word",
      func: this.getTargetWord.bind(this),
      descriptionKey: "describers.getTargetWord"
    },
    {
      name: "common_words",
      func: this.getCommonWords.bind(this),
      descriptionKey: "describers.commonWords"
    }
  ];
}
