import SpaceInvadersExercise from "../../exercise-categories/space-invaders/SpaceInvadersExercise";

export default class SpaceInvadersNestedRepeatExercise extends SpaceInvadersExercise {
  protected shotCooldown: number | false = false;

  public availableFunctions = [
    {
      name: "move",
      func: this.moveRight.bind(this),
      description: "moved the laser cannon to the right"
    },
    {
      name: "shoot",
      func: this.shoot.bind(this),
      description: "shot the laser upwards"
    }
  ];
}
