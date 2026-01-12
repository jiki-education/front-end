import { type ExecutionContext } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

type GameStatus = "running" | "won" | "lost";
type AlienStatus = "alive" | "dead";

class Alien {
  public status: AlienStatus;
  public lastKilledAt?: number;
  public respawnsAt?: number;

  public constructor(
    public elem: HTMLElement,
    public row: number,
    public col: number,
    public type: number
  ) {
    this.status = "alive";
  }

  public isAlive(time: number): boolean {
    if (this.status === "alive") {
      return true;
    }
    if (this.respawnsAt === undefined) {
      return false;
    }

    return time > this.respawnsAt;
  }
}

export default class ScrollAndShootExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
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
  private lastShotAt = 0;

  availableFunctions = [
    {
      name: "move_left",
      func: this.moveLeft.bind(this),
      description: "Move the laser cannon to the left"
    },
    {
      name: "move_right",
      func: this.moveRight.bind(this),
      description: "Move the laser cannon to the right"
    },
    {
      name: "shoot",
      func: this.shoot.bind(this),
      description: "Shoot the laser upwards"
    },
    {
      name: "is_alien_above",
      func: this.isAlienAbove.bind(this),
      description: "Check if there is an alien above the laser cannon"
    }
  ];

  constructor() {
    super();
  }

  protected populateView() {
    this.view.style.cssText = `
      width: 100%;
      height: 500px;
      position: relative;
      background-color: #222;
      background-image: radial-gradient(rgba(255, 255, 255, 0.05), black);
      overflow: hidden;
    `;

    // Calculate initial laser position (12% is the starting position)
    const initialLeft = this.laserStart;

    this.laser = document.createElement("div");
    this.laser.classList.add("laser");
    this.laser.style.cssText = `
      --laser-width: 20%;
      position: absolute;
      bottom: 2%;
      left: ${initialLeft}%;
      width: var(--laser-width);
      height: calc(var(--laser-width) * (115 / 200));
      transform: translateX(-50%);
      background-size: cover;
      background-image: url('/static/images/exercise-assets/space-invaders/laser.svg');
      z-index: 20;
    `;
    this.view.appendChild(this.laser);
  }

  public setupAliens(rows: number[][]) {
    this.aliens = rows.map((row, rowIdx) => {
      return row.map((type, colIdx) => {
        if (type === 0) return null;
        return this.addAlien(rowIdx, colIdx, type);
      });
    });
    this.startingAliens = JSON.parse(JSON.stringify(this.aliens.map(row =>
      row.map(alien => alien ? { ...alien, elem: alien.elem } : null)
    )));
  }

  public enableAlienRespawning() {
    this.features.alienRespawning = true;
  }

  private addAlien(row: number, col: number, type: number): Alien {
    const alien = document.createElement("div");
    alien.classList.add("alien");
    alien.id = `alien-${Math.random().toString(36).slice(2, 11)}`;
    alien.style.cssText = `
      --alien-width: 8%;
      position: absolute;
      left: ${this.laserStart + col * this.laserStep}%;
      top: ${10 + row * 11}%;
      width: var(--alien-width);
      height: calc(var(--alien-width) * (160 / 200));
      transform: translateX(-50%);
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      filter: invert(1);
    `;

    const parts = [
      { name: "tl", svg: "a1-tl.svg" },
      { name: "tr", svg: "a1-tr.svg" },
      { name: "bl", svg: "a1-bl.svg" },
      { name: "br", svg: "a1-br.svg" }
    ];

    parts.forEach((part) => {
      const partElem = document.createElement("div");
      partElem.classList.add(part.name);
      partElem.style.cssText = `
        background-size: cover;
        background-image: url('/static/images/exercise-assets/space-invaders/${part.svg}');
      `;
      alien.appendChild(partElem);
    });

    this.view.appendChild(alien);
    return new Alien(alien, row, col, type);
  }

  private killAlien(
    executionCtx: ExecutionContext,
    alien: Alien,
    shot: HTMLElement
  ) {
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
        left: this.laserPositions[this.laserPosition]
      },
      offset: executionCtx.getCurrentTimeInMs()
    });
    executionCtx.fastForward(this.moveDuration);
  }

  private allAliensDead(executionCtx: ExecutionContext): boolean {
    return this.aliens.every((row) =>
      row.every(
        (alien) =>
          alien === null || !alien.isAlive(executionCtx.getCurrentTimeInMs())
      )
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
        "Oh no! Your laser cannon overheated from shooting too fast! You need to move before you can shoot a second time."
      );
    }
    this.lastShotAt = executionCtx.getCurrentTimeInMs();

    let targetRow: number | null = null;
    let targetAlien: Alien | null = null;

    this.aliens.forEach((row, rowIdx) => {
      const alien = row[this.laserPosition];
      if (alien === null) {
        return;
      }
      if (!alien.isAlive(executionCtx.getCurrentTimeInMs())) {
        return;
      }

      targetRow = rowIdx;
      targetAlien = row[this.laserPosition];
    });

    let targetTop: string | number;
    if (targetRow === null) {
      targetTop = -10;
    } else {
      targetTop = 10 + targetRow * 11;
    }

    const duration = this.shotDuration;

    const shot = document.createElement("div");
    shot.classList.add("shot");
    shot.id = `shot-${Math.random().toString(36).slice(2, 11)}`;
    shot.style.cssText = `
      position: absolute;
      left: ${this.laserPositions[this.laserPosition]}%;
      top: 85%;
      width: 4px;
      height: 15px;
      background: #0f0;
      opacity: 0;
    `;
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
      this.gameStatus = "lost";
      executionCtx.logicError("Oh no, you tried to move off the edge!");
    }

    this.laserPosition -= 1;
    this.moveLaser(executionCtx);
  }

  public moveRight(executionCtx: ExecutionContext) {
    if (this.laserPosition === this.maxLaserPosition) {
      this.gameStatus = "lost";
      executionCtx.logicError("Oh no, you tried to move off the edge!");
    }

    this.laserPosition += 1;
    this.moveLaser(executionCtx);
  }

  public getState() {
    return {
      gameStatus: this.gameStatus,
      laserPosition: this.laserPosition
    };
  }
}
