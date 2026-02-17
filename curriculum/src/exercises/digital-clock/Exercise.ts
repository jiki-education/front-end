import { type ExecutionContext, type ExternalFunction, type Shared, isNumber, isString } from "@jiki/interpreters";
import { VisualExercise } from "../../VisualExercise";
import metadata from "./metadata.json";

export default class DigitalClockExercise extends VisualExercise {
  protected get slug() {
    return metadata.slug;
  }

  private currentHour: number = 0;
  private currentMinute: number = 0;
  displayedTime: string | undefined = undefined;

  availableFunctions: ExternalFunction[] = [
    {
      name: "current_time_hour",
      func: this.currentTimeHour.bind(this),
      description: "retrieved the current hour"
    },
    {
      name: "current_time_minute",
      func: this.currentTimeMinute.bind(this),
      description: "retrieved the current minute"
    },
    {
      name: "display_time",
      func: this.displayTime.bind(this),
      description: "displayed the time on the clock"
    }
  ];

  currentTimeHour(_executionCtx: ExecutionContext): number {
    return this.currentHour;
  }

  currentTimeMinute(_executionCtx: ExecutionContext): number {
    return this.currentMinute;
  }

  displayTime(
    executionCtx: ExecutionContext,
    hour: Shared.JikiObject,
    minutes: Shared.JikiObject,
    indicator: Shared.JikiObject
  ) {
    if (!isNumber(hour)) {
      executionCtx.logicError("hour must be a number");
      return;
    }
    if (!isNumber(minutes)) {
      executionCtx.logicError("minutes must be a number");
      return;
    }
    if (!isString(indicator)) {
      executionCtx.logicError("indicator must be a string");
      return;
    }
    this.displayedTime = `${hour.value}:${minutes.value}${indicator.value}`;
  }

  setTime(hour: number, minute: number) {
    this.currentHour = hour;
    this.currentMinute = minute;
  }

  getState() {
    return {
      displayedTime: this.displayedTime ?? ""
    };
  }

  protected populateView() {
    this.view.style.position = "relative";
    this.view.style.width = "100%";
    this.view.style.height = "100%";
  }
}
