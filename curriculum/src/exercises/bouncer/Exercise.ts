import { type ExecutionContext, type ExternalFunction } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

export default class BouncerExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  private age: number = 21;
  doorOpened: boolean = false;

  private closedDoorImg!: HTMLImageElement;
  private openDoorImg!: HTMLImageElement;

  constructor() {
    super();
    this.view.classList.add("exercise-bouncer");
    this.populateView();
  }

  availableFunctions: ExternalFunction[] = [
    {
      name: "get_age",
      func: this.getAge.bind(this),
      description: "retrieved the person's age"
    },
    {
      name: "open_door",
      func: this.openDoor.bind(this),
      description: "opened the door"
    }
  ];

  getAge(_executionCtx: ExecutionContext): number {
    return this.age;
  }

  openDoor(executionCtx: ExecutionContext) {
    this.doorOpened = true;
    this.animateOutOfView(executionCtx, `#${this.view.id} .closed-door`);
    this.animateIntoView(executionCtx, `#${this.view.id} .open-door`);
  }

  setupAge(age: number) {
    this.age = age;
  }

  setupImages(closedUrl: string, openUrl: string) {
    this.closedDoorImg.src = closedUrl;
    this.openDoorImg.src = openUrl;
  }

  getState() {
    return {
      age: this.age,
      doorOpened: this.doorOpened
    };
  }

  protected populateView() {
    this.view.style.position = "relative";
    this.view.style.width = "100%";
    this.view.style.height = "100%";
    this.view.style.overflow = "hidden";

    this.closedDoorImg = document.createElement("img");
    this.closedDoorImg.className = "closed-door";
    this.closedDoorImg.style.position = "absolute";
    this.closedDoorImg.style.width = "100%";
    this.closedDoorImg.style.height = "100%";
    this.closedDoorImg.style.objectFit = "cover";
    this.view.appendChild(this.closedDoorImg);

    this.openDoorImg = document.createElement("img");
    this.openDoorImg.className = "open-door";
    this.openDoorImg.style.position = "absolute";
    this.openDoorImg.style.width = "100%";
    this.openDoorImg.style.height = "100%";
    this.openDoorImg.style.objectFit = "cover";
    this.openDoorImg.style.opacity = "0";
    this.view.appendChild(this.openDoorImg);
  }
}
