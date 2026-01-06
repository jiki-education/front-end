import { type ExecutionContext } from "@jiki/interpreters";
import { VisualExercise } from "@/src/VisualExercise";
import metadata from "./metadata.json";

export default class BasicMovementExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }
  position: number = 0;

  availableFunctions = [
    {
      name: "move",
      func: this.move.bind(this),
      description: "Move the character 20px forward"
    }
  ];

  move(executionCtx: ExecutionContext) {
    this.position += 20;

    this.animations.push({
      targets: `#${this.view.id} .character`,
      offset: executionCtx.getCurrentTimeInMs(),
      duration: 100,
      transformations: {
        left: this.position
      }
    });

    executionCtx.fastForward(100);
  }

  setStartPosition(position: number) {
    this.position = position;
  }

  getState() {
    return {
      position: this.position
    };
  }

  protected populateView() {
    const container = document.createElement("div");
    this.view.appendChild(container);
    container.className = "exercise-container";
    container.style.cssText = `
      width: 100%;
      height: 200px;
      position: relative;
      border: 1px solid #ccc;
      background: linear-gradient(to right, #f0f0f0 0%, #f0f0f0 49.5%, #ddd 49.5%, #ddd 50.5%, #f0f0f0 50.5%);
      background-size: 100px 100%;
    `;

    const character = document.createElement("div");
    character.className = "character";
    character.style.cssText = `
      width: 20px;
      height: 20px;
      background: #4A90E2;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 20px;
      transform: translateY(-50%) translateX(${this.position}px);
      transition: transform 0.3s ease;
    `;
    container.appendChild(character);
  }
}
