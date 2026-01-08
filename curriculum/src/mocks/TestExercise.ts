import { type ExecutionContext, type ExternalFunction } from "@jiki/interpreters";
import { VisualExercise } from "../VisualExercise";

export class TestExercise extends VisualExercise {
  protected get slug() {
    return "test-exercise";
  }
  position: number = 0;
  counter: number = 0;

  availableFunctions: ExternalFunction[] = [
    {
      name: "move",
      func: this.move.bind(this),
      description: "Move the character 20px forward"
    },
    {
      name: "increment",
      func: this.increment.bind(this),
      description: "Increment the counter"
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

  increment(executionCtx: ExecutionContext) {
    this.counter += 1;
    executionCtx.fastForward(10);
  }

  setStartPosition(position: number) {
    this.position = position;
  }

  setCounter(counter: number) {
    this.counter = counter;
  }

  getState() {
    return {
      position: this.position,
      counter: this.counter
    };
  }

  protected populateView() {
    this.view.innerHTML = `
      <div class="character" style="position: absolute; left: ${this.position}px;">
        Character
      </div>
      <div class="counter">
        Counter: ${this.counter}
      </div>
    `;
  }
}
