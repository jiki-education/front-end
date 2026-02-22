import { type ExecutionContext, type Shared, isNumber } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

export default class DndRollExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  private rollQueue: number[] = [];
  private rollIndex = 0;
  announcements: number[] = [];
  strikeAttack: number | undefined;
  strikeDamage: number | undefined;
  struck = false;

  private diceContainer!: HTMLElement;
  private announcementsContainer!: HTMLElement;
  private strikeContainer!: HTMLElement;

  constructor() {
    super();
    this.populateView();
  }

  setupRolls(values: number[]) {
    this.rollQueue = values;
    this.rollIndex = 0;
  }

  private roll(executionCtx: ExecutionContext, _sides: Shared.JikiObject): number {
    if (this.rollIndex >= this.rollQueue.length) {
      executionCtx.logicError("No more dice rolls available");
      return 0;
    }
    const value = this.rollQueue[this.rollIndex];
    this.rollIndex++;

    const dieEl = document.createElement("div");
    dieEl.className = "die-result";
    dieEl.textContent = String(value);
    dieEl.style.opacity = "0";
    this.diceContainer.appendChild(dieEl);

    this.animateIntoView(executionCtx, `#${this.view.id} .die-result:nth-child(${this.rollIndex})`);

    return value;
  }

  private announce(executionCtx: ExecutionContext, value: Shared.JikiObject) {
    if (!isNumber(value)) {
      return executionCtx.logicError("You can only announce a number");
    }
    this.announcements.push(value.value);

    const announcementEl = document.createElement("div");
    announcementEl.className = "announcement";
    announcementEl.textContent = String(value.value);
    announcementEl.style.opacity = "0";
    this.announcementsContainer.appendChild(announcementEl);

    this.animateIntoView(executionCtx, `#${this.view.id} .announcement:nth-child(${this.announcements.length})`);
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

    const strikeEl = document.createElement("div");
    strikeEl.className = "strike-result";
    strikeEl.textContent = `Attack: ${attack.value} | Damage: ${damage.value}`;
    strikeEl.style.opacity = "0";
    this.strikeContainer.appendChild(strikeEl);

    this.animateIntoView(executionCtx, `#${this.view.id} .strike-result`);
  }

  protected populateView() {
    this.diceContainer = document.createElement("div");
    this.diceContainer.className = "dice-container";
    this.view.appendChild(this.diceContainer);

    this.announcementsContainer = document.createElement("div");
    this.announcementsContainer.className = "announcements-container";
    this.view.appendChild(this.announcementsContainer);

    this.strikeContainer = document.createElement("div");
    this.strikeContainer.className = "strike-container";
    this.view.appendChild(this.strikeContainer);
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
