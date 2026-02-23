import { VisualExercise } from "../../VisualExercise";
import { jikiscript, javascript } from "@jiki/interpreters";
import type { ExecutionContext, ExternalFunction, Shared } from "@jiki/interpreters";
import type { Language } from "../../types";
import metadata from "./metadata.json";

// Helper to read a numeric field from either a Jikiscript or JS instance
function getFieldValue(instance: Shared.JikiObject, name: string): number {
  const inst = instance as jikiscript.Instance | javascript.JSInstance;
  return inst.getUnwrappedField(name);
}

// Helper to set a numeric field on either a Jikiscript or JS instance
function setFieldOnInstance(instance: Shared.JikiObject, name: string, value: number) {
  const inst = instance as jikiscript.Instance | javascript.JSInstance;
  if (inst instanceof jikiscript.Instance) {
    inst.setField(name, new jikiscript.Number(value));
  } else {
    inst.setField(name, new javascript.JSNumber(value));
  }
}

export default class BoundarieBallExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  private moveBallCallCount = 0;
  private ballPositions: Array<{ cx: number; cy: number }> = [];

  // Field names differ between Jikiscript (snake_case) and JavaScript (camelCase)
  private velocityFieldX = "x_velocity";
  private velocityFieldY = "y_velocity";

  availableFunctions: ExternalFunction[] = [
    {
      name: "move_ball",
      func: (executionCtx: ExecutionContext, ballArg: Shared.JikiObject) => {
        // Read current state from the ball instance
        const cx = getFieldValue(ballArg, "cx");
        const cy = getFieldValue(ballArg, "cy");
        const xVelocity = getFieldValue(ballArg, this.velocityFieldX);
        const yVelocity = getFieldValue(ballArg, this.velocityFieldY);

        const newCx = cx + xVelocity;
        const newCy = cy + yVelocity;

        // Write updated position back to the ball instance
        setFieldOnInstance(ballArg, "cx", newCx);
        setFieldOnInstance(ballArg, "cy", newCy);

        // Track positions for wall midpoint checks
        this.ballPositions.push({ cx: newCx, cy: newCy });
        this.moveBallCallCount++;

        // Animate ball movement
        this.addAnimation({
          targets: `#${this.view.id} .ball`,
          offset: executionCtx.getCurrentTimeInMs(),
          duration: 1,
          transformations: {
            left: `${newCx}%`,
            top: `${newCy}%`
          }
        });
        executionCtx.fastForward(1);
      },
      description: "Moves the ball according to its velocity"
    }
  ];

  private createJikiscriptBallClass(): jikiscript.Class {
    const BallClass = new jikiscript.Class("Ball");

    BallClass.addProperty("cx");
    BallClass.addProperty("cy");
    BallClass.addProperty("radius");
    BallClass.addProperty("x_velocity");
    BallClass.addProperty("y_velocity");

    BallClass.addConstructor((_ctx: ExecutionContext, obj: jikiscript.Instance) => {
      obj.setField("cx", new jikiscript.Number(50));
      obj.setField("cy", new jikiscript.Number(97));
      obj.setField("radius", new jikiscript.Number(3));
      obj.setField("x_velocity", new jikiscript.Number(-1));
      obj.setField("y_velocity", new jikiscript.Number(-1));
    });

    BallClass.addGetter("cx", "public");
    BallClass.addGetter("cy", "public");
    BallClass.addGetter("radius", "public");
    BallClass.addGetter("x_velocity", "public");
    BallClass.addSetter("x_velocity", "public");
    BallClass.addGetter("y_velocity", "public");
    BallClass.addSetter("y_velocity", "public");

    return BallClass;
  }

  private createJSBallClass(): javascript.JSClass {
    const BallClass = new javascript.JSClass("Ball");

    BallClass.addProperty("cx");
    BallClass.addProperty("cy");
    BallClass.addProperty("radius");
    BallClass.addProperty("xVelocity");
    BallClass.addProperty("yVelocity");

    BallClass.addConstructor((_ctx: ExecutionContext, obj: javascript.JSInstance) => {
      obj.setField("cx", new javascript.JSNumber(50));
      obj.setField("cy", new javascript.JSNumber(97));
      obj.setField("radius", new javascript.JSNumber(3));
      obj.setField("xVelocity", new javascript.JSNumber(-1));
      obj.setField("yVelocity", new javascript.JSNumber(-1));
    });

    BallClass.addGetter("cx", "public");
    BallClass.addGetter("cy", "public");
    BallClass.addGetter("radius", "public");
    BallClass.addGetter("xVelocity", "public");
    BallClass.addSetter("xVelocity", "public");
    BallClass.addGetter("yVelocity", "public");
    BallClass.addSetter("yVelocity", "public");

    return BallClass;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getExternalClasses(language: Language): any[] {
    if (language === "jikiscript") {
      this.velocityFieldX = "x_velocity";
      this.velocityFieldY = "y_velocity";
      return [this.createJikiscriptBallClass()];
    }
    if (language === "javascript") {
      this.velocityFieldX = "xVelocity";
      this.velocityFieldY = "yVelocity";
      return [this.createJSBallClass()];
    }
    return [];
  }

  didBallAppearAt(cx: number, cy: number): boolean {
    return this.ballPositions.some((pos) => pos.cx === cx && pos.cy === cy);
  }

  getState() {
    return {
      moveBallCallCount: this.moveBallCallCount,
      ballCx: this.ballPositions.length > 0 ? this.ballPositions[this.ballPositions.length - 1].cx : 50,
      ballCy: this.ballPositions.length > 0 ? this.ballPositions[this.ballPositions.length - 1].cy : 97
    };
  }

  protected populateView() {
    const gameArea = document.createElement("div");
    gameArea.className = "game-area";
    gameArea.style.width = "100%";
    gameArea.style.height = "100%";
    gameArea.style.position = "relative";
    this.view.appendChild(gameArea);

    const ball = document.createElement("div");
    ball.className = "ball";
    ball.style.position = "absolute";
    ball.style.left = "50%";
    ball.style.top = "97%";
    ball.style.width = "6%";
    ball.style.height = "6%";
    ball.style.borderRadius = "50%";
    ball.style.transform = "translate(-50%, -50%)";
    gameArea.appendChild(ball);
  }
}
