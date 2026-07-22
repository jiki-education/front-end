import SpaceInvadersExercise from "../../exercise-categories/space-invaders/SpaceInvadersExercise";

export default class BattleProceduresExercise extends SpaceInvadersExercise {
  public availableFunctions = [
    {
      name: "move_left",
      func: this.moveLeft.bind(this),
      descriptionKey: "describers.moveLeft"
    },
    {
      name: "move_right",
      func: this.moveRight.bind(this),
      descriptionKey: "describers.moveRight"
    },
    {
      name: "shoot",
      func: this.shoot.bind(this),
      descriptionKey: "describers.shoot"
    },
    {
      name: "is_alien_above",
      func: this.isAlienAbove.bind(this),
      descriptionKey: "describers.isAlienAbove"
    }
  ];
}
