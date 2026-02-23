import { type ExecutionContext, type ExternalFunction, type Shared, isNumber } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";

export default class GolfExercise extends VisualExercise {
  protected get slug() {
    return "golf";
  }

  ball: HTMLElement = document.createElement("div");
  ballX: number = 28;
  ballY: number = 75;
  fireworksFired: boolean = false;
  shotLength: number = 0;
  private moveDuration = 50;

  constructor() {
    super();
    this.view.classList.add("exercise-golf");
    this.populateView();
  }

  availableFunctions: ExternalFunction[] = [
    {
      name: "roll_right",
      func: this.rollRight.bind(this),
      description: "rolled the ball one unit to the right"
    },
    {
      name: "roll_to",
      func: this.rollTo.bind(this),
      description: "rolled the ball to the given position"
    },
    {
      name: "get_shot_length",
      func: this.getShotLength.bind(this),
      description: "retrieved the shot length"
    },
    {
      name: "fire_fireworks",
      func: this.fireFireworks.bind(this),
      description: "fired off celebratory fireworks"
    }
  ];

  rollRight(executionCtx: ExecutionContext) {
    this.ballX += 1;
    this.addAnimation({
      targets: `#${this.view.id} .ball`,
      offset: executionCtx.getCurrentTimeInMs(),
      duration: this.moveDuration,
      transformations: {
        left: `${this.ballX}%`
      }
    });
    executionCtx.fastForward(this.moveDuration);
  }

  rollTo(executionCtx: ExecutionContext, x: Shared.JikiObject, y?: Shared.JikiObject) {
    if (!isNumber(x)) {
      return executionCtx.logicError("x must be a number");
    }
    this.ballX = x.value;
    if (y !== undefined) {
      if (!isNumber(y)) {
        return executionCtx.logicError("y must be a number");
      }
      this.ballY = y.value;
    }
    this.addAnimation({
      targets: `#${this.view.id} .ball`,
      offset: executionCtx.getCurrentTimeInMs(),
      duration: this.moveDuration,
      transformations: {
        left: `${this.ballX}%`,
        top: `${this.ballY}%`
      }
    });
    executionCtx.fastForward(this.moveDuration);
  }

  getShotLength(_executionCtx: ExecutionContext): number {
    return this.shotLength;
  }

  fireFireworks(executionCtx: ExecutionContext) {
    this.fireworksFired = true;
    executionCtx.fastForward(2500);
  }

  setupBallPosition(x: number, y: number) {
    this.ballX = x;
    this.ballY = y;
    this.ball.style.left = `${x}%`;
    this.ball.style.top = `${y}%`;
  }

  setupShotLength(length: number) {
    this.shotLength = length;
  }

  setupBackground(imageUrl: string) {
    this.view.style.backgroundImage = `url(${imageUrl})`;
    this.view.style.backgroundSize = "cover";
    this.view.style.backgroundPosition = "center";
  }

  getState() {
    return {
      ballX: this.ballX,
      ballY: this.ballY,
      fireworksFired: this.fireworksFired
    };
  }

  protected populateView() {
    this.ball.className = "ball";
    this.ball.style.left = `${this.ballX}%`;
    this.ball.style.top = `${this.ballY}%`;
    this.view.appendChild(this.ball);
  }
}
