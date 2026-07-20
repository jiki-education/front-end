import SpaceInvadersExercise from "../../exercise-categories/space-invaders/SpaceInvadersExercise";

export default class SpaceInvadersNestedRepeatExercise extends SpaceInvadersExercise {
  protected preventRepeatShot: boolean = false;

  public availableFunctions = [
    {
      name: "move",
      func: this.moveRight.bind(this),
      descriptionKey: "describers.move"
    },
    {
      name: "shoot",
      func: this.shoot.bind(this),
      descriptionKey: "describers.shoot"
    }
  ];
}
