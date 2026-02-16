import { type ExecutionContext, type Shared, isNumber } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

export default class PlantTheFlowersExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  flowers: number[] = [];

  public availableFunctions = [
    {
      name: "plant",
      func: this.plant.bind(this),
      description: "planted a flower at position ${arg1}"
    }
  ];

  plant(executionCtx: ExecutionContext, position: Shared.JikiObject) {
    if (!isNumber(position)) {
      return executionCtx.logicError("Position must be a number");
    }

    this.flowers.push(position.value);

    const flower = document.createElement("div");
    flower.className = "flower";
    flower.style.position = "absolute";
    flower.style.left = `${position.value}%`;
    flower.style.bottom = "20%";
    flower.style.opacity = "0";
    this.view.appendChild(flower);

    this.animateIntoView(executionCtx, `#${this.view.id} .flower:nth-child(${this.flowers.length})`);
  }

  hasFlowerAt(position: number): boolean {
    return this.flowers.includes(position);
  }

  getState() {
    return {
      flowerCount: this.flowers.length
    };
  }
}
