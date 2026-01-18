import { IOExercise } from "../../IOExercise";
import metadata from "./metadata.json";

export default class GuestListExercise extends IOExercise {
  static slug = metadata.slug;
  static availableFunctions = [];
}
