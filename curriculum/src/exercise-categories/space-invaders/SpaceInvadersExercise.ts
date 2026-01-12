import { VisualExercise } from "../../VisualExercise";
import type { ExecutionContext } from "@jiki/interpreters";

type GameStatus = "running" | "won" | "lost";
type AlienStatus = "alive" | "dead";
class Alien {
  public status: AlienStatus;
  public lastKilledAt?: number;
  public respawnsAt?: number;

  public constructor(
    public elem: HTMLElement,
    _row: number,
    _col: number,
    _type: number
  ) {
    this.status = "alive";
  }

  public isAlive(time: number) {
    if (this.status === "alive") {
      return true;
    }
    if (this.respawnsAt === undefined) {
      return false;
    }

    return time > this.respawnsAt;
  }
}

export default class SpaceInvadersExercise extends VisualExercise {
  protected get slug() {
    return "space-invaders";
  }

  private gameStatus: GameStatus = "running";
  private moveDuration = 200;
  private shotDuration = 1000;

  private minLaserPosition = 0;
  private maxLaserPosition = 10;
  private laserStart = 12;
  private laserStep = 7.5;
  private laserPositions = Array.from(
    { length: this.maxLaserPosition + 1 },
    (_, idx) => this.laserStart + idx * this.laserStep
  );
  private laserPosition = 0;
  private features = { alienRespawning: false };
  private laser!: HTMLElement;
  private aliens: (Alien | null)[][] = [];
  private startingAliens: (Alien | null)[][] = [];
  private lastShotAt = -100;

  constructor() {
    super();
    this.populateView();
  }

  protected populateView() {
    this.laser = document.createElement("div");
    this.laser.classList.add("laser");
    this.laser.style.left = `${this.laserPositions[this.laserPosition]}%`;
    this.view.appendChild(this.laser);
  }

  public getState() {
    return { gameStatus: this.gameStatus };
  }

  public setupAliens(rows: number[][]) {
    this.aliens = rows.map((row, rowIdx) => {
      return row.map((type, colIdx) => {
        if (type === 0) return null;
        return this.addAlien(rowIdx, colIdx, type);
      });
    });
    this.startingAliens = JSON.parse(JSON.stringify(this.aliens));
  }

  public enableAlienRespawning() {
    this.features.alienRespawning = true;
  }

  private addAlien(row: number, col: number, type: number) {
    const alien = document.createElement("div");
    alien.classList.add("alien");
    alien.id = `alien-${Math.random().toString(36).slice(2, 11)}`;
    alien.style.left = `${this.laserStart + col * this.laserStep}%`;
    alien.style.top = `${10 + row * 11}%`;

    const parts = ["tl", "tr", "bl", "br"];
    parts.forEach((pos) => {
      const part = document.createElement("div");
      part.classList.add(pos);
      alien.appendChild(part);
    });
    this.view.appendChild(alien);

    return new Alien(alien, row, col, type);
  }

  private killAlien(executionCtx: ExecutionContext, alien: Alien, shot: HTMLElement) {
    const deathTime = executionCtx.getCurrentTimeInMs() + this.shotDuration;
    alien.status = "dead";
    [
      ["tl", -10, -10, -180],
      ["tr", 10, -10, 180],
      ["bl", -10, 10, -180],
      ["br", 10, 10, 180]
    ].forEach(([pos, x, y, rotate]) => {
      this.addAnimation({
        targets: `#${this.view.id} #${alien.elem.id} .${pos}`,
        duration: 300,
        transformations: {
          translateX: x as number,
          translateY: y as number,
          rotate: rotate as number,
          opacity: 0
        },
        offset: deathTime
      });
    });
    this.addAnimation({
      targets: `#${this.view.id} #${shot.id}`,
      duration: 1,
      transformations: { opacity: 0 },
      offset: deathTime
    });
    executionCtx.fastForward(1);
    this.respawnAlien(executionCtx, alien);
  }

  private respawnAlien(executionCtx: ExecutionContext, alien: Alien) {
    if (!this.features.alienRespawning) {
      return;
    }

    // Only respawn each alien once
    if (alien.respawnsAt !== undefined) {
      alien.respawnsAt = undefined;
      return;
    }

    // Stop respawning aliens after the first few seconds
    if (executionCtx.getCurrentTimeInMs() > 5000) {
      return;
    }

    // Skip 80% of the time
    if (Math.random() > 0.3) {
      return;
    }

    const respawnsAt = executionCtx.getCurrentTimeInMs() + this.shotDuration + 1000;
    alien.respawnsAt = respawnsAt;
    ["tl", "tr", "bl", "br"].forEach((pos) => {
      this.addAnimation({
        targets: `#${this.view.id} #${alien.elem.id} .${pos}`,
        duration: 1,
        transformations: { translateX: 0, translateY: 0, rotate: 0 },
        offset: respawnsAt
      });
      this.addAnimation({
        targets: `#${this.view.id} #${alien.elem.id} .${pos}`,
        duration: 100,
        transformations: { opacity: 1 },
        offset: respawnsAt
      });
    });
  }

  private moveLaser(executionCtx: ExecutionContext) {
    this.addAnimation({
      targets: `#${this.view.id} .laser`,
      duration: this.moveDuration,
      transformations: {
        opacity: 1,
        left: `${this.laserPositions[this.laserPosition]}%`
      },
      offset: executionCtx.getCurrentTimeInMs()
    });
    executionCtx.fastForward(this.moveDuration);
  }

  private allAliensDead(executionCtx: ExecutionContext) {
    return this.aliens.every((row) =>
      row.every((alien) => alien === null || !alien.isAlive(executionCtx.getCurrentTimeInMs()))
    );
  }

  private checkForWin(executionCtx: ExecutionContext) {
    if (this.allAliensDead(executionCtx)) {
      this.gameStatus = "won";
    }
  }

  public isAlienAbove(executionCtx: ExecutionContext): boolean {
    return this.aliens.some((row) => {
      const alien = row[this.laserPosition];
      if (alien === null) {
        return false;
      }
      return alien.isAlive(executionCtx.getCurrentTimeInMs());
    });
  }

  public shoot(executionCtx: ExecutionContext) {
    if (this.lastShotAt > executionCtx.getCurrentTimeInMs() - 50) {
      executionCtx.logicError(
        "Oh no! Your laser canon overheated from shooting too fast! You need to move before you can shoot a second time."
      );
    }
    this.lastShotAt = executionCtx.getCurrentTimeInMs();

    let targetRow = null;
    let targetAlien: Alien | null = null;
    this.aliens.forEach((row, rowIdx) => {
      const alien = row[this.laserPosition];
      if (alien == null) {
        return;
      }
      if (!alien.isAlive(executionCtx.getCurrentTimeInMs())) {
        return;
      }

      targetRow = rowIdx;
      targetAlien = row[this.laserPosition];
    });

    let targetTop;
    if (targetRow === null) {
      targetTop = -10;
    } else {
      targetTop = `${10 + targetRow * 11}%`;
    }

    // TODO: Vary speed based on distance
    const duration = this.shotDuration;

    const shot = document.createElement("div");
    shot.classList.add("shot");
    shot.id = `shot-${Math.random().toString(36).slice(2, 11)}`;
    shot.style.left = `${this.laserPositions[this.laserPosition]}%`;
    shot.style.top = "85%";
    shot.style.opacity = "0";
    this.view.appendChild(shot);

    this.addAnimation({
      targets: `#${this.view.id} #${shot.id}`,
      duration: 1,
      transformations: { opacity: 1 },
      offset: executionCtx.getCurrentTimeInMs()
    });
    this.addAnimation({
      targets: `#${this.view.id} #${shot.id}`,
      duration: duration,
      transformations: { top: targetTop },
      offset: executionCtx.getCurrentTimeInMs(),
      easing: "linear"
    });

    if (targetAlien === null) {
      this.gameStatus = "lost";
      executionCtx.logicError("Oh no, you missed. Wasting ammo is not allowed!");
    } else {
      this.killAlien(executionCtx, targetAlien, shot);

      // Let the bullet leave the laser before moving
      executionCtx.fastForward(30);

      this.checkForWin(executionCtx);
    }
  }

  public moveLeft(executionCtx: ExecutionContext) {
    if (this.laserPosition === this.minLaserPosition) {
      executionCtx.logicError("Oh no, you tried to move off the edge!");
    }

    this.laserPosition -= 1;
    this.moveLaser(executionCtx);
  }

  public moveRight(executionCtx: ExecutionContext) {
    if (this.laserPosition === this.maxLaserPosition) {
      executionCtx.logicError("Oh no, you tried to move off the edge!");
    }

    this.laserPosition += 1;
    this.moveLaser(executionCtx);
  }

  public getStartingAliensInRow(executionCtx: ExecutionContext, row: number): boolean[] {
    if (typeof row !== "number") {
      executionCtx.logicError("Oh no, the row input you provided is not a number.");
    }

    if (row < 1 || row > this.startingAliens.length) {
      executionCtx.logicError(
        `Oh no, you tried to access a row of aliens that doesn't exist. You asked for row ${row}, but there are only ${this.startingAliens.length} rows of aliens.`
      );
    }

    const reversedAliens = this.startingAliens.slice().reverse();
    return reversedAliens[row - 1].map((alien) => alien !== null);
  }

  public getStartingAliens(_: ExecutionContext): boolean[][] {
    return this.startingAliens.map((row) => row.map((alien) => alien !== null));
  }

  public fireFireworks(executionCtx: ExecutionContext) {
    if (!this.allAliensDead(executionCtx)) {
      executionCtx.logicError("You need to defeat all the aliens before you can celebrate!");
    }
    // VisualExercise doesn't have fireFireworks, so just mark as won
    this.gameStatus = "won";
    executionCtx.fastForward(2500);
  }

  public wasFireworksCalledInsideRepeatLoop(_result: unknown): boolean {
    // TODO: Re-implement when AST analysis is available
    return false;
  }

  public availableFunctions = [
    {
      name: "move_left",
      func: this.moveLeft.bind(this),
      description: "moved the laser canon to the left"
    },
    {
      name: "moveLeft",
      func: this.moveLeft.bind(this),
      description: "moved the laser canon to the left"
    },
    {
      name: "move_right",
      func: this.moveRight.bind(this),
      description: "moved the laser canon to the right"
    },
    {
      name: "moveRight",
      func: this.moveRight.bind(this),
      description: "moved the laser canon to the right"
    },
    {
      name: "shoot",
      func: this.shoot.bind(this),
      description: "shot the laser upwards"
    },
    {
      name: "is_alien_above",
      func: this.isAlienAbove.bind(this),
      description: "determined if there was an alien above the laser canon"
    },
    {
      name: "get_starting_aliens_in_row",
      func: this.getStartingAliensInRow.bind(this),
      description: "retrieved the starting positions of row ${arg1} of aliens"
    },
    {
      name: "getStartingAliens",
      func: this.getStartingAliens.bind(this),
      description: "retrieved the starting positions of row ${arg1} of aliens"
    },
    {
      name: "fire_fireworks",
      func: this.fireFireworks.bind(this),
      description: "fired off celebratory fireworks"
    }
  ];
}
