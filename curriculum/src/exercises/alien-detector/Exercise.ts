import SpaceInvadersExercise from "../../exercise-categories/space-invaders/SpaceInvadersExercise";

export default class AlienDetectorExercise extends SpaceInvadersExercise {
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
      name: "get_starting_aliens_in_row",
      func: this.getStartingAliensInRow.bind(this),
      description: "retrieved the starting positions of row ${arg1} of aliens"
    },
    {
      name: "fire_fireworks",
      func: this.fireFireworks.bind(this),
      description: "fired off celebratory fireworks"
    }
  ];
}
