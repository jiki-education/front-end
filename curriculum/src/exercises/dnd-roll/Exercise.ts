import { type ExecutionContext, type Shared, isNumber } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

interface DieConfig {
  image: string;
  top: string;
  left: string;
  width: string;
  height: string;
  fontSize: string;
  numberTop: string;
}

const DICE: Record<number, DieConfig> = {
  10: {
    image: "/static/images/exercise-assets/dnd-roll/d10.png",
    top: "11%",
    left: "38%",
    width: "24%",
    height: "auto",
    fontSize: "8cqw",
    numberTop: "48%"
  },
  12: {
    image: "/static/images/exercise-assets/dnd-roll/d12.png",
    top: "11%",
    left: "38%",
    width: "24%",
    height: "auto",
    fontSize: "8cqw",
    numberTop: "50%"
  },
  20: {
    image: "/static/images/exercise-assets/dnd-roll/d20.png",
    top: "11%",
    left: "39%",
    width: "22%",
    height: "auto",
    fontSize: "5cqw",
    numberTop: "50%"
  }
};

export default class DndRollExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  private presetRolls: Record<number, number> = {};
  initialRolls: Record<number, number> = {};
  private rollIndex = 0;
  announcements: number[] = [];
  strikeAttack: number | undefined;
  strikeDamage: number | undefined;
  struck = false;

  private announcementSlots: HTMLElement[] = [];

  constructor() {
    super();
    this.populateView();
  }

  setupRolls(values: Record<number, number>) {
    this.presetRolls = { ...values };
    this.initialRolls = { ...values };
  }

  private roll(executionCtx: ExecutionContext, sides: Shared.JikiObject): number {
    const sidesNum = isNumber(sides) ? sides.value : 20;
    const dieConfig = DICE[sidesNum] as DieConfig | undefined;
    if (dieConfig == null) {
      executionCtx.logicError(`Sorry - Jiki doesn't have a ${sidesNum} sided dice handy!`);
      return 0;
    }

    let value: number;
    if (sidesNum in this.presetRolls) {
      value = this.presetRolls[sidesNum];
      delete this.presetRolls[sidesNum];
    } else {
      value = Math.floor(Math.random() * sidesNum) + 1;
    }

    // Animate out the previous die if there is one
    if (this.rollIndex > 0) {
      this.animateOutOfView(executionCtx, `#${this.view.id} .die-result-${this.rollIndex}`);
    }

    this.rollIndex++;

    const dieEl = document.createElement("div");
    dieEl.className = `die-result die-result-${this.rollIndex}`;
    dieEl.style.position = "absolute";
    dieEl.style.top = dieConfig.top;
    dieEl.style.left = dieConfig.left;
    dieEl.style.width = dieConfig.width;
    dieEl.style.height = dieConfig.height;
    dieEl.style.opacity = "0";

    const dieImg = document.createElement("img");
    dieImg.src = dieConfig.image;
    dieImg.style.width = "100%";
    dieImg.style.height = "100%";
    dieImg.style.objectFit = "contain";
    dieEl.appendChild(dieImg);

    const numOverlay = document.createElement("span");
    numOverlay.className = "die-number";
    numOverlay.textContent = String(value);
    numOverlay.style.position = "absolute";
    numOverlay.style.top = dieConfig.numberTop;
    numOverlay.style.left = "50%";
    numOverlay.style.transform = "translate(-50%, -50%)";
    numOverlay.style.fontFamily = "monospace";
    numOverlay.style.fontSize = dieConfig.fontSize;
    numOverlay.style.fontWeight = "bold";
    numOverlay.style.color = "#000";
    numOverlay.style.opacity = "0";
    dieEl.appendChild(numOverlay);

    this.view.appendChild(dieEl);

    const targets = `#${this.view.id} .die-result-${this.rollIndex}`;
    const duration = 300;
    this.animateIntoView(executionCtx, targets);
    this.addAnimation({
      targets,
      duration,
      transformations: {
        rotate: 5040
      },
      offset: executionCtx.getCurrentTimeInMs()
    });
    executionCtx.fastForward(300);

    // Fade in the number after spinning stops
    this.addAnimation({
      targets: `${targets} .die-number`,
      duration: 1,
      transformations: {
        opacity: 1
      },
      offset: executionCtx.getCurrentTimeInMs()
    });
    executionCtx.fastForward(200);

    return value;
  }

  private announce(executionCtx: ExecutionContext, value: Shared.JikiObject) {
    if (!isNumber(value)) {
      return executionCtx.logicError("You can only announce a number");
    }
    this.announcements.push(value.value);

    const slotIndex = this.announcements.length - 1;
    if (slotIndex < this.announcementSlots.length) {
      const slot = this.announcementSlots[slotIndex];
      slot.textContent = String(value.value);
      this.animateIntoView(executionCtx, `#${this.view.id} .announcement-slot:nth-child(${slotIndex + 1})`);
    }
    executionCtx.fastForward(200);
  }

  private strike(executionCtx: ExecutionContext, attack: Shared.JikiObject, damage: Shared.JikiObject) {
    if (!isNumber(attack)) {
      return executionCtx.logicError("Attack must be a number");
    }
    if (!isNumber(damage)) {
      return executionCtx.logicError("Damage must be a number");
    }
    this.strikeAttack = attack.value;
    this.strikeDamage = damage.value;
    this.struck = true;

    this.animateOutOfView(executionCtx, `#${this.view.id} .goblin`);
    this.animateIntoView(executionCtx, `#${this.view.id} .goblin-dead`);
  }

  protected populateView() {
    // Set background and container for cqw units
    this.view.style.backgroundImage = "url(/static/images/exercise-assets/dnd-roll/background.jpg)";
    this.view.style.backgroundSize = "cover";
    this.view.style.backgroundPosition = "center";
    this.view.style.position = "relative";
    this.view.style.width = "100%";
    this.view.style.aspectRatio = "1";
    this.view.style.containerType = "inline-size";

    // Three announcement slots positioned over the three black boxes
    const announcementsContainer = document.createElement("div");
    announcementsContainer.className = "announcements-container";
    announcementsContainer.style.position = "absolute";
    announcementsContainer.style.top = "47%";
    announcementsContainer.style.left = "8%";
    announcementsContainer.style.width = "84%";
    announcementsContainer.style.height = "22%";
    announcementsContainer.style.display = "flex";
    announcementsContainer.style.justifyContent = "space-between";
    announcementsContainer.style.alignItems = "center";
    this.view.appendChild(announcementsContainer);

    for (let i = 0; i < 3; i++) {
      const slot = document.createElement("div");
      slot.className = "announcement-slot";
      slot.style.width = "30%";
      slot.style.height = "100%";
      slot.style.display = "flex";
      slot.style.alignItems = "center";
      slot.style.justifyContent = "center";
      slot.style.fontFamily = "monospace";
      slot.style.fontSize = "10cqw";
      slot.style.fontWeight = "bold";
      slot.style.color = "greenyellow";
      slot.style.opacity = "0";
      announcementsContainer.appendChild(slot);
      this.announcementSlots.push(slot);
    }

    // Goblin image at the bottom
    const goblin = document.createElement("img");
    goblin.className = "goblin";
    goblin.src = "/static/images/exercise-assets/dnd-roll/goblin.png";
    goblin.style.position = "absolute";
    goblin.style.bottom = "2%";
    goblin.style.left = "50%";
    goblin.style.transform = "translateX(-50%)";
    goblin.style.width = "25%";
    goblin.style.height = "auto";
    this.view.appendChild(goblin);

    // Dead goblin (hidden until strike)
    const goblinDead = document.createElement("img");
    goblinDead.className = "goblin-dead";
    goblinDead.src = "/static/images/exercise-assets/dnd-roll/goblin-dead.png";
    goblinDead.style.position = "absolute";
    goblinDead.style.bottom = "5px";
    goblinDead.style.left = "50%";
    goblinDead.style.transform = "translateX(-50%)";
    goblinDead.style.width = "35%";
    goblinDead.style.height = "auto";
    goblinDead.style.opacity = "0";
    this.view.appendChild(goblinDead);
  }

  availableFunctions = [
    {
      name: "roll",
      func: this.roll.bind(this),
      description: "rolled a die and got ${return}",
      arity: 1 as const
    },
    {
      name: "announce",
      func: this.announce.bind(this),
      description: "announced ${arg1}",
      arity: 1 as const
    },
    {
      name: "strike",
      func: this.strike.bind(this),
      description: "struck the goblin with attack ${arg1} and damage ${arg2}",
      arity: 2 as const
    }
  ];

  getState() {
    return {
      rollCount: this.rollIndex,
      announcementCount: this.announcements.length,
      struck: this.struck,
      strikeAttack: this.strikeAttack ?? 0,
      strikeDamage: this.strikeDamage ?? 0
    };
  }
}
