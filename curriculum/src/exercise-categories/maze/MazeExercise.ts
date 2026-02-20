import { type ExecutionContext, type ExternalFunction } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";

type Direction = "up" | "right" | "down" | "left";

export default class MazeExercise extends VisualExercise {
  protected get slug() {
    return "maze";
  }
  character: HTMLElement = document.createElement("div");
  characterRow: number = 0;
  characterCol: number = 0;
  direction: Direction = "down";
  rotation: number = 0; // Continuous rotation value in degrees
  grid: number[][] = [];

  constructor() {
    super();
    this.populateView();
  }

  availableFunctions: ExternalFunction[] = [
    {
      name: "move",
      func: this.move.bind(this),
      description: "Move the character forward one cell"
    },
    {
      name: "turn_left",
      func: this.turnLeft.bind(this),
      description: "Turn the character 90 degrees left"
    },
    {
      name: "turn_right",
      func: this.turnRight.bind(this),
      description: "Turn the character 90 degrees right"
    }
  ];

  move(executionCtx: ExecutionContext) {
    let newRow = this.characterRow;
    let newCol = this.characterCol;

    // Calculate new position based on direction
    switch (this.direction) {
      case "up":
        newRow--;
        break;
      case "down":
        newRow++;
        break;
      case "left":
        newCol--;
        break;
      case "right":
        newCol++;
        break;
    }

    // Check if move is valid (within bounds and not blocked)
    if (newRow < 0 || newRow >= this.grid.length || newCol < 0 || newCol >= this.grid[0].length) {
      executionCtx.logicError("Cannot move outside the maze!");
      return;
    }

    if (this.grid[newRow][newCol] === 1) {
      executionCtx.logicError("Cannot move into a blocked cell!");
      return;
    }

    // Update position
    this.characterRow = newRow;
    this.characterCol = newCol;

    // Calculate percentage positions (center of cell)
    const cellWidth = 100 / this.grid[0].length;
    const cellHeight = 100 / this.grid.length;
    const left = this.characterCol * cellWidth + cellWidth / 2;
    const top = this.characterRow * cellHeight + cellHeight / 2;

    // Add animation for movement
    this.animations.push({
      targets: `#${this.view.id} .character`,
      offset: executionCtx.getCurrentTimeInMs(),
      duration: 200,
      transformations: {
        left: left,
        top: top
      }
    });

    executionCtx.fastForward(200);
  }

  turnLeft(executionCtx: ExecutionContext) {
    // Rotate 90 degrees counter-clockwise
    this.rotation -= 90;

    // Update direction
    const directions: Direction[] = ["down", "right", "up", "left"];
    const currentIndex = directions.indexOf(this.direction);
    this.direction = directions[(currentIndex + 1) % 4];

    // Add rotation animation
    this.animations.push({
      targets: `#${this.view.id} .character`,
      offset: executionCtx.getCurrentTimeInMs(),
      duration: 150,
      transformations: {
        rotate: this.rotation
      }
    });

    executionCtx.fastForward(150);
  }

  turnRight(executionCtx: ExecutionContext) {
    // Rotate 90 degrees clockwise
    this.rotation += 90;

    // Update direction
    const directions: Direction[] = ["down", "left", "up", "right"];
    const currentIndex = directions.indexOf(this.direction);
    this.direction = directions[(currentIndex + 1) % 4];

    // Add rotation animation
    this.animations.push({
      targets: `#${this.view.id} .character`,
      offset: executionCtx.getCurrentTimeInMs(),
      duration: 150,
      transformations: {
        rotate: this.rotation
      }
    });

    executionCtx.fastForward(150);
  }

  setupGrid(grid: number[][]) {
    this.grid = grid;
    // Regenerate the view with the new grid
    this.view.innerHTML = "";
    this.populateView();
  }

  setupPosition(row: number, col: number) {
    this.characterRow = row;
    this.characterCol = col;
  }

  setupDirection(dir: Direction) {
    this.direction = dir;
    // Set initial rotation based on direction
    const rotationMap: Record<Direction, number> = {
      up: 0,
      right: 90,
      down: 180,
      left: -90
    };
    this.rotation = rotationMap[dir];
    this.character.style.transform = `rotate(${this.rotation}deg)`;
  }

  getGameResult(): string | null {
    if (this.grid.length === 0) return null;
    const targetCell = this.grid[this.characterRow]?.[this.characterCol];
    return targetCell === 3 ? "win" : null;
  }

  getState() {
    const gameResult = this.getGameResult();
    return {
      position: `${this.characterRow},${this.characterCol}`,
      direction: this.direction,
      gameResult: gameResult ?? "playing"
    };
  }

  protected populateView() {
    if ((this.grid?.length ?? 0) === 0) return;

    const gridSize = this.grid.length;
    this.view.style.setProperty("--gridSize", gridSize.toString());

    // Create cells grid
    const cellsContainer = document.createElement("div");
    cellsContainer.className = "cells";
    cellsContainer.style.gridTemplateColumns = `repeat(${this.grid[0].length}, 1fr)`;
    cellsContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    this.view.appendChild(cellsContainer);

    // Generate cells from grid
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        const cell = document.createElement("div");
        cell.className = "cell";

        const cellValue = this.grid[row][col];
        if (cellValue === 1) cell.classList.add("blocked");
        if (cellValue === 2) cell.classList.add("start");
        if (cellValue === 3) cell.classList.add("target");

        cellsContainer.appendChild(cell);
      }
    }

    // Create character with absolute positioning
    const cellWidth = 100 / this.grid[0].length;
    const cellHeight = 100 / this.grid.length;
    const left = this.characterCol * cellWidth + cellWidth / 2;
    const top = this.characterRow * cellHeight + cellHeight / 2;

    this.character.className = "character";
    this.character.style.left = `${left}%`;
    this.character.style.top = `${top}%`;
    this.view.appendChild(this.character);
  }
}
