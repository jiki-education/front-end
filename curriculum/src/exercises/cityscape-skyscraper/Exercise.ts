import CityScapeExercise from "../../exercise-categories/cityscape/CityScapeExercise";
import type { AvailableFunction } from "../../types";
import metadata from "./metadata.json";

export default class CityScapeSkyscraperExercise extends CityScapeExercise {
  protected get slug() {
    return metadata.slug;
  }

  public availableFunctions: AvailableFunction[] = [
    {
      name: "build_wall",
      func: this.buildWall.bind(this),
      descriptionKey: "describers.buildWall"
    },
    {
      name: "build_entrance",
      func: this.buildEntrance.bind(this),
      descriptionKey: "describers.buildEntrance"
    },
    {
      name: "build_glass",
      func: this.buildGlass.bind(this),
      descriptionKey: "describers.buildGlass"
    },
    {
      name: "num_floors",
      func: this.getNumFloors.bind(this),
      descriptionKey: "describers.numFloors"
    }
  ];
}
