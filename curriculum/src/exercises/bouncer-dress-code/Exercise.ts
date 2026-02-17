import { type ExecutionContext, type ExternalFunction } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

export default class BouncerDressCodeExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  private outfit: string = "suit";
  champagneOffered: boolean = false;
  wasLetIn: boolean = false;
  wasTurnedAway: boolean = false;

  private baseImg!: HTMLImageElement;
  private champagneEntryImg!: HTMLImageElement;
  private entryImg!: HTMLImageElement;
  private turnedAwayImg!: HTMLImageElement;

  constructor() {
    super();
    this.view.classList.add("exercise-bouncer-dress-code");
    this.populateView();
  }

  availableFunctions: ExternalFunction[] = [
    {
      name: "get_outfit",
      func: this.getOutfit.bind(this),
      description: "retrieved the person's outfit"
    },
    {
      name: "offer_champagne",
      func: this.offerChampagne.bind(this),
      description: "offered champagne"
    },
    {
      name: "let_in",
      func: this.letIn.bind(this),
      description: "let the person in"
    },
    {
      name: "turn_away",
      func: this.turnAway.bind(this),
      description: "turned the person away"
    }
  ];

  getOutfit(_executionCtx: ExecutionContext): string {
    return this.outfit;
  }

  offerChampagne(executionCtx: ExecutionContext) {
    this.champagneOffered = true;
    this.animateIntoView(executionCtx, `#${this.view.id} .champagne-entry`);
  }

  letIn(executionCtx: ExecutionContext) {
    this.wasLetIn = true;
    this.animateIntoView(executionCtx, `#${this.view.id} .entry`);
  }

  turnAway(executionCtx: ExecutionContext) {
    this.wasTurnedAway = true;
    this.animateIntoView(executionCtx, `#${this.view.id} .turned-away`);
  }

  setupOutfit(outfit: string) {
    this.outfit = outfit;
  }

  setupImages(baseUrl: string, champagneEntryUrl: string, entryUrl: string, turnedAwayUrl: string) {
    this.baseImg.src = baseUrl;
    this.champagneEntryImg.src = champagneEntryUrl;
    this.entryImg.src = entryUrl;
    this.turnedAwayImg.src = turnedAwayUrl;
  }

  getState() {
    return {
      outfit: this.outfit,
      champagneOffered: this.champagneOffered,
      wasLetIn: this.wasLetIn,
      wasTurnedAway: this.wasTurnedAway
    };
  }

  protected populateView() {
    this.view.style.position = "relative";
    this.view.style.width = "100%";
    this.view.style.height = "100%";
    this.view.style.overflow = "hidden";

    this.baseImg = this.createImage("base");
    this.champagneEntryImg = this.createImage("champagne-entry");
    this.entryImg = this.createImage("entry");
    this.turnedAwayImg = this.createImage("turned-away");
  }

  private createImage(className: string): HTMLImageElement {
    const img = document.createElement("img");
    img.className = className;
    img.style.position = "absolute";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    if (className !== "base") {
      img.style.opacity = "0";
    }
    this.view.appendChild(img);
    return img;
  }
}
