import { type ExecutionContext, type ExternalFunction } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

type WristbandType = "child" | "teen" | "adult" | "senior";

export default class BouncerWristbandsExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  private age: number = 30;
  wristband: string | null = null;
  private issued = false;
  private expectedType: WristbandType = "adult";

  private expectedImg!: HTMLImageElement;
  private actualImgs!: Record<WristbandType, HTMLImageElement>;
  private wristbandUrls: Record<WristbandType, string> = { child: "", teen: "", adult: "", senior: "" };

  constructor() {
    super();
    this.view.classList.add("exercise-bouncer-wristbands");
    this.populateView();
  }

  availableFunctions: ExternalFunction[] = [
    {
      name: "get_age",
      func: this.getAge.bind(this),
      description: "retrieved the person's age"
    },
    {
      name: "give_child_wristband",
      func: this.giveChildWristband.bind(this),
      description: "gave a child wristband"
    },
    {
      name: "give_teen_wristband",
      func: this.giveTeenWristband.bind(this),
      description: "gave a teen wristband"
    },
    {
      name: "give_adult_wristband",
      func: this.giveAdultWristband.bind(this),
      description: "gave an adult wristband"
    },
    {
      name: "give_senior_wristband",
      func: this.giveSeniorWristband.bind(this),
      description: "gave a senior wristband"
    }
  ];

  getAge(_executionCtx: ExecutionContext): number {
    return this.age;
  }

  giveChildWristband(executionCtx: ExecutionContext) {
    this.giveWristband(executionCtx, "child");
  }

  giveTeenWristband(executionCtx: ExecutionContext) {
    this.giveWristband(executionCtx, "teen");
  }

  giveAdultWristband(executionCtx: ExecutionContext) {
    this.giveWristband(executionCtx, "adult");
  }

  giveSeniorWristband(executionCtx: ExecutionContext) {
    this.giveWristband(executionCtx, "senior");
  }

  private giveWristband(executionCtx: ExecutionContext, type: WristbandType) {
    if (this.issued) {
      return executionCtx.logicError("You've already given this person a wristband - each person should only get one.");
    }
    this.issued = true;
    this.wristband = type;

    const offset = executionCtx.getCurrentTimeInMs();

    // Reveal the wristband the student actually gave.
    this.addAnimation({
      targets: `#${this.view.id} .actual .wristband-${type}`,
      offset,
      duration: 0.1,
      transformations: { opacity: 1 }
    });

    // Recolour the Actual box: pending (yellow) -> green if right, red if wrong.
    const correct = type === this.expectedType;
    this.addAnimation({
      targets: `#${this.view.id} .actual`,
      offset,
      duration: 0.1,
      transformations: {
        borderColor: correct ? "var(--color-green-600)" : "var(--color-red-600)",
        backgroundColor: correct ? "var(--color-green-30)" : "var(--color-red-30)"
      }
    });

    executionCtx.fastForward(1);
  }

  setupAge(age: number) {
    this.age = age;
  }

  setupImages(childUrl: string, teenUrl: string, adultUrl: string, seniorUrl: string) {
    this.wristbandUrls = { child: childUrl, teen: teenUrl, adult: adultUrl, senior: seniorUrl };
    this.actualImgs.child.src = childUrl;
    this.actualImgs.teen.src = teenUrl;
    this.actualImgs.adult.src = adultUrl;
    this.actualImgs.senior.src = seniorUrl;
  }

  setupExpectedWristband(type: WristbandType) {
    this.expectedType = type;
    this.expectedImg.src = this.wristbandUrls[type];
  }

  getState() {
    return {
      age: this.age,
      wristband: this.wristband ?? ""
    };
  }

  protected populateView() {
    this.view.style.position = "relative";
    this.view.style.width = "100%";
    this.view.style.height = "100%";
    this.view.style.boxSizing = "border-box";
    this.view.style.background = "#ffffff";
    this.view.style.overflow = "hidden";
    this.view.style.containerType = "size";

    this.view.appendChild(this.createLabel("Expected", "7%"));
    // Expected box is always purple - it just shows the correct answer.
    const expectedSlot = this.createSlot("15%", "33%", "var(--color-purple-600)", "var(--color-purple-30)");
    expectedSlot.classList.add("expected");
    this.expectedImg = this.createImageIn(expectedSlot, "wristband-expected", true);
    this.view.appendChild(expectedSlot);

    this.view.appendChild(this.createLabel("Actual", "54%"));
    // Actual box starts in the "pending" (yellow) state, then turns green/red.
    const actualSlot = this.createSlot("62%", "33%", "var(--color-yellow-600)", "var(--color-yellow-30)");
    actualSlot.classList.add("actual");
    this.actualImgs = {
      child: this.createImageIn(actualSlot, "wristband-child", false),
      teen: this.createImageIn(actualSlot, "wristband-teen", false),
      adult: this.createImageIn(actualSlot, "wristband-adult", false),
      senior: this.createImageIn(actualSlot, "wristband-senior", false)
    };
    this.view.appendChild(actualSlot);
  }

  private createLabel(text: string, top: string): HTMLElement {
    const label = document.createElement("div");
    label.textContent = text;
    label.style.position = "absolute";
    label.style.top = top;
    label.style.left = "0";
    label.style.width = "100%";
    label.style.textAlign = "center";
    label.style.fontWeight = "600";
    label.style.fontSize = "5cqw";
    label.style.color = "var(--color-gray-700)";
    return label;
  }

  private createSlot(top: string, height: string, borderColor: string, background: string): HTMLElement {
    const slot = document.createElement("div");
    slot.style.position = "absolute";
    slot.style.top = top;
    slot.style.left = "8%";
    slot.style.width = "84%";
    slot.style.height = height;
    slot.style.boxSizing = "border-box";
    slot.style.border = `2px solid ${borderColor}`;
    slot.style.borderRadius = "8px";
    slot.style.background = background;
    slot.style.display = "grid";
    slot.style.padding = "3%";
    slot.style.placeItems = "center";
    return slot;
  }

  private createImageIn(parent: HTMLElement, className: string, visible: boolean): HTMLImageElement {
    const img = document.createElement("img");
    img.className = className;
    // All images share the single grid cell so the Actual box's layers overlap.
    img.style.gridArea = "1 / 1";
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";
    img.style.opacity = visible ? "1" : "0";
    parent.appendChild(img);
    return img;
  }
}
