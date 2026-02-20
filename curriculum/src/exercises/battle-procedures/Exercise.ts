import SpaceInvadersExercise from "../../exercise-categories/space-invaders/SpaceInvadersExercise";

export default class BattleProceduresExercise extends SpaceInvadersExercise {
  public availableFunctions = [
    {
      name: "move_left",
      func: this.moveLeft.bind(this),
      description: "moved the laser cannon to the left"
    },
    {
      name: "move_right",
      func: this.moveRight.bind(this),
      description: "moved the laser cannon to the right"
    },
    {
      name: "shoot",
      func: this.shoot.bind(this),
      description: "shot the laser upwards"
    },
    {
      name: "is_alien_above",
      func: this.isAlienAbove.bind(this),
      description: "determined if there was an alien above the laser cannon"
    }
  ];
}
