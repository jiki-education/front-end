import FlowerPlantingExercise from "../../exercise-categories/flower-planting/FlowerPlantingExercise";
import metadata from "./metadata.json";

export default class PlantTheFlowersExercise extends FlowerPlantingExercise {
  protected get slug() {
    return metadata.slug;
  }

  public availableFunctions = [
    {
      name: "plant",
      func: this.plant.bind(this),
      description: "planted a flower at position ${arg1}"
    }
  ];
}
