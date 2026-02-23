import CityScapeExercise from "../../exercise-categories/cityscape/CityScapeExercise";
import metadata from "./metadata.json";

export default class CityScapeSkyscraperExercise extends CityScapeExercise {
  protected get slug() {
    return metadata.slug;
  }

  public availableFunctions = [
    {
      name: "build_wall",
      func: this.buildWall.bind(this),
      description: "built a wall at position (${arg1}, ${arg2})"
    },
    {
      name: "build_entrance",
      func: this.buildEntrance.bind(this),
      description: "built an entrance at position (${arg1}, ${arg2})"
    },
    {
      name: "build_glass",
      func: this.buildGlass.bind(this),
      description: "built a glass panel at position (${arg1}, ${arg2})"
    },
    {
      name: "num_floors",
      func: this.getNumFloors.bind(this),
      description: "retrieved the number of floors"
    }
  ];
}
