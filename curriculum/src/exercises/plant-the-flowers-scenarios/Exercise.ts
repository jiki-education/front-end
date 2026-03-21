import type { ExecutionContext } from "@jiki/interpreters";
import FlowerPlantingExercise from "../../exercise-categories/flower-planting/FlowerPlantingExercise";
import metadata from "./metadata.json";

export default class PlantTheFlowersScenariosExercise extends FlowerPlantingExercise {
  protected get slug() {
    return metadata.slug;
  }

  private numFlowers = 3;

  public availableFunctions = [
    {
      name: "ask_number_of_flowers",
      func: this.getNumFlowers.bind(this),
      description: "asked for the number of flowers to plant"
    },
    {
      name: "plant",
      func: this.plant.bind(this),
      description: "planted a flower at position ${arg1}"
    }
  ];

  setupNumFlowers(n: number) {
    this.numFlowers = n;
  }

  getNumFlowers(_executionCtx: ExecutionContext): number {
    return this.numFlowers;
  }
}
