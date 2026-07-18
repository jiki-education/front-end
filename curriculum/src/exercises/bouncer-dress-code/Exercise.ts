import { type ExecutionContext } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import type { AvailableFunction } from "../../types";
import metadata from "./metadata.json";

export default class BouncerDressCodeExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  private outfit: string = "suit";
  private age: number = 30;
  private onList: boolean = false;
  champagneOffered: boolean = false;
  canapesOffered: boolean = false;
  wasLetIn: boolean = false;
  wasTurnedAway: boolean = false;

  private backgroundImg!: HTMLImageElement;
  private resultImg!: HTMLImageElement;

  constructor() {
    super();
    this.view.classList.add("exercise-bouncer-dress-code");
    this.populateView();
  }

  availableFunctions: AvailableFunction[] = [
    {
      name: "get_outfit",
      func: this.getOutfit.bind(this),
      descriptionKey: "describers.getOutfit"
    },
    {
      name: "get_age",
      func: this.getAge.bind(this),
      descriptionKey: "describers.getAge"
    },
    {
      name: "on_guest_list",
      func: this.onGuestList.bind(this),
      descriptionKey: "describers.onGuestList"
    },
    {
      name: "offer_champagne",
      func: this.offerChampagne.bind(this),
      descriptionKey: "describers.offerChampagne"
    },
    {
      name: "offer_canapes",
      func: this.offerCanapes.bind(this),
      descriptionKey: "describers.offerCanapes"
    },
    {
      name: "let_in",
      func: this.letIn.bind(this),
      descriptionKey: "describers.letIn"
    },
    {
      name: "turn_away",
      func: this.turnAway.bind(this),
      descriptionKey: "describers.turnAway"
    }
  ];

  getOutfit(_executionCtx: ExecutionContext): string {
    return this.outfit;
  }

  getAge(_executionCtx: ExecutionContext): number {
    return this.age;
  }

  onGuestList(_executionCtx: ExecutionContext): boolean {
    return this.onList;
  }

  offerChampagne(executionCtx: ExecutionContext) {
    this.champagneOffered = true;
    this.animateIntoView(executionCtx, `#${this.view.id} .result`);
  }

  offerCanapes(executionCtx: ExecutionContext) {
    this.canapesOffered = true;
    this.animateIntoView(executionCtx, `#${this.view.id} .result`);
  }

  letIn(executionCtx: ExecutionContext) {
    this.wasLetIn = true;
    this.animateIntoView(executionCtx, `#${this.view.id} .result`);
  }

  turnAway(executionCtx: ExecutionContext) {
    this.wasTurnedAway = true;
    this.animateIntoView(executionCtx, `#${this.view.id} .result`);
  }

  setupOutfit(outfit: string) {
    this.outfit = outfit;
  }

  setupAge(age: number) {
    this.age = age;
  }

  setupOnGuestList(onList: boolean) {
    this.onList = onList;
  }

  setupBackground(imageUrl: string) {
    this.backgroundImg.src = imageUrl;
  }

  setupResultImage(imageUrl: string) {
    this.resultImg.src = imageUrl;
  }

  getState() {
    return {
      outfit: this.outfit,
      age: this.age,
      onGuestList: this.onList,
      champagneOffered: this.champagneOffered,
      canapesOffered: this.canapesOffered,
      wasLetIn: this.wasLetIn,
      wasTurnedAway: this.wasTurnedAway
    };
  }

  protected populateView() {
    this.view.style.position = "relative";
    this.view.style.width = "100%";
    this.view.style.height = "100%";
    this.view.style.overflow = "hidden";

    this.backgroundImg = document.createElement("img");
    this.backgroundImg.className = "background";
    this.backgroundImg.style.position = "absolute";
    this.backgroundImg.style.width = "100%";
    this.backgroundImg.style.height = "100%";
    this.backgroundImg.style.objectFit = "cover";
    this.view.appendChild(this.backgroundImg);

    this.resultImg = document.createElement("img");
    this.resultImg.className = "result";
    this.resultImg.style.position = "absolute";
    this.resultImg.style.width = "100%";
    this.resultImg.style.height = "100%";
    this.resultImg.style.objectFit = "cover";
    this.resultImg.style.opacity = "0";
    this.view.appendChild(this.resultImg);
  }
}
