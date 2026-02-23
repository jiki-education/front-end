import MazeExercise from "../../exercise-categories/maze/MazeExercise";
import { type ExecutionContext, type Shared, isString, isDictionary, isNumber } from "@jiki/interpreters";
import metadata from "./metadata.json";

type Direction = "up" | "right" | "down" | "left";

// Mapping from relative look direction to absolute direction, based on current facing
const DIRECTION_MAP: Record<Direction, Record<string, Direction>> = {
  down: { ahead: "down", left: "right", right: "left" },
  right: { ahead: "right", left: "up", right: "down" },
  up: { ahead: "up", left: "left", right: "right" },
  left: { ahead: "left", left: "down", right: "up" }
};

// Grid value to emoji mapping
const CELL_EMOJI_MAP: Record<number, string> = {
  0: "⬜",
  1: "🧱",
  2: "⭐",
  3: "🏁",
  4: "🔥",
  5: "💩"
};

export default class EmojiCollectorExercise extends MazeExercise {
  protected get slug() {
    return metadata.slug;
  }

  collectedEmojis: Record<string, number> = {};
  private emojiMode = false;

  availableFunctions = [
    {
      name: "move",
      func: this.moveAndCheck.bind(this),
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
    },
    {
      name: "look",
      func: this.look.bind(this),
      description: "Look in a direction and see what's there"
    },
    {
      name: "remove_emoji",
      func: this.removeEmoji.bind(this),
      description: "Remove the emoji from the current square"
    },
    {
      name: "announce_emojis",
      func: this.announceEmojis.bind(this),
      description: "Announce the collected emojis"
    }
  ];

  private moveAndCheck(executionCtx: ExecutionContext) {
    this.move(executionCtx);

    if (this.grid[this.characterRow]?.[this.characterCol] === 3) {
      executionCtx.exerciseFinished();
    }
  }

  private cellToEmoji(value: number | string): string {
    if (typeof value === "string") return value;
    return CELL_EMOJI_MAP[value] ?? "⬜";
  }

  look(_executionCtx: ExecutionContext, direction: Shared.JikiObject): string {
    if (!isString(direction)) {
      _executionCtx.logicError("direction must be a string");
      return "";
    }

    const dir = direction.value;

    // "down" means look at current cell
    if (dir === "down") {
      return this.cellToEmoji(this.grid[this.characterRow][this.characterCol]);
    }

    // Convert relative direction to absolute
    const facing = this.direction as Direction;
    const absoluteDir = DIRECTION_MAP[facing]?.[dir];
    if (!absoluteDir) {
      _executionCtx.logicError(`Invalid direction: ${dir}. Use "ahead", "left", "right", or "down".`);
      return "";
    }

    let targetRow = this.characterRow;
    let targetCol = this.characterCol;

    switch (absoluteDir) {
      case "up":
        targetRow--;
        break;
      case "down":
        targetRow++;
        break;
      case "left":
        targetCol--;
        break;
      case "right":
        targetCol++;
        break;
    }

    // Out of bounds = wall
    if (targetRow < 0 || targetRow >= this.grid.length || targetCol < 0 || targetCol >= this.grid[0].length) {
      return "🧱";
    }

    return this.cellToEmoji(this.grid[targetRow][targetCol]);
  }

  removeEmoji(_executionCtx: ExecutionContext) {
    this.grid[this.characterRow][this.characterCol] = 0;
  }

  announceEmojis(_executionCtx: ExecutionContext, emojisArg: Shared.JikiObject) {
    if (!isDictionary(emojisArg)) {
      _executionCtx.logicError("emojis must be a dictionary");
      return;
    }

    const dict: Record<string, number> = {};
    for (const [key, value] of emojisArg.value.entries()) {
      if (isNumber(value)) {
        dict[key] = value.value;
      }
    }
    this.collectedEmojis = dict;
  }

  // Setup methods called from scenarios
  enableEmojiMode() {
    this.emojiMode = true;
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

    const cellsContainer = document.createElement("div");
    cellsContainer.className = "cells";
    cellsContainer.style.gridTemplateColumns = `repeat(${this.grid[0].length}, 1fr)`;
    cellsContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    this.view.appendChild(cellsContainer);

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        const cell = document.createElement("div");
        cell.className = "cell";

        const cellValue = this.grid[row][col];
        if (cellValue === 1) cell.classList.add("blocked");
        if (cellValue === 2) cell.classList.add("start");
        if (cellValue === 3) cell.classList.add("target");

        if (this.emojiMode && typeof cellValue === "string") {
          cell.textContent = cellValue;
        }

        cellsContainer.appendChild(cell);
      }
    }

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
