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

  private h1Elem!: HTMLDivElement;
  private h2Elem!: HTMLDivElement;
  private m1Elem!: HTMLDivElement;
  private m2Elem!: HTMLDivElement;
  private meridiem!: HTMLDivElement;

  public constructor() {
    super();
    this.populateView();
  }

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

    const [h1, h2] = String(hour.value).padStart(2, "0").split("");
    const [m1, m2] = String(minutes.value).padStart(2, "0").split("");

    this.h1Elem.innerText = h1;
    this.h2Elem.innerText = h2;
    this.m1Elem.innerText = m1;
    this.m2Elem.innerText = m2;

    if (indicator.value === "am" || indicator.value === "pm") {
      this.meridiem.innerText = indicator.value;
      this.meridiem.classList.add(indicator.value);
    }
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
    const time = document.createElement("div");
    time.classList.add("time");
    this.view.appendChild(time);

    const hour = document.createElement("div");
    hour.classList.add("hour");
    time.appendChild(hour);

    this.h1Elem = document.createElement("div");
    this.h1Elem.classList.add("h1");
    hour.appendChild(this.h1Elem);

    this.h2Elem = document.createElement("div");
    this.h2Elem.classList.add("h2");
    hour.appendChild(this.h2Elem);

    const colon = document.createElement("div");
    colon.classList.add("colon");
    colon.innerText = ":";
    time.appendChild(colon);

    const minute = document.createElement("div");
    minute.classList.add("minute");
    time.appendChild(minute);

    this.m1Elem = document.createElement("div");
    this.m1Elem.classList.add("m1");
    minute.appendChild(this.m1Elem);

    this.m2Elem = document.createElement("div");
    this.m2Elem.classList.add("m2");
    minute.appendChild(this.m2Elem);

    this.meridiem = document.createElement("div");
    this.meridiem.classList.add("meridiem");
    this.view.appendChild(this.meridiem);
  }
}
