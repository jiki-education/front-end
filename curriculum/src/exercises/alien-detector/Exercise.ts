import SpaceInvadersExercise from "../../exercise-categories/space-invaders/SpaceInvadersExercise";

export default class AlienDetectorExercise extends SpaceInvadersExercise {
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
      name: "get_starting_aliens_in_row",
      func: this.getStartingAliensInRow.bind(this),
      descriptionKey: "describers.getStartingAliensInRow"
    },
    {
      name: "fire_fireworks",
      func: this.fireFireworks.bind(this),
      descriptionKey: "describers.fireFireworks"
    }
  ];
}
