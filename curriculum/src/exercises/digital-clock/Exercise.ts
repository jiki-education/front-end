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
    this.displayedTime = `${hour.value}:${String(minutes.value).padStart(2, "0")}${indicator.value}`;

    const [h1, h2] = String(hour.value).padStart(2, "0").split("");
    const [m1, m2] = String(minutes.value).padStart(2, "0").split("");
    const offset = executionCtx.getCurrentTimeInMs();
    const digitModifier = (v: number) => String(Math.round(v));

    const digits: Array<[string, string]> = [
      [".h1", h1],
      [".h2", h2],
      [".m1", m1],
      [".m2", m2]
    ];

    for (const [selector, digit] of digits) {
      this.addAnimation({
        targets: `#${this.view.id} ${selector}`,
        offset,
        duration: 0,
        easing: "linear",
        modifier: digitModifier,
        transformations: {
          innerHTML: Number(digit),
          opacity: 1
        }
      });
    }

    if (indicator.value === "am" || indicator.value === "pm") {
      this.addAnimation({
        targets: `#${this.view.id} .meridiem.${indicator.value}`,
        offset,
        duration: 0,
        easing: "linear",
        transformations: { opacity: 1 }
      });
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

    const h1 = document.createElement("div");
    h1.classList.add("h1");
    h1.innerHTML = "0";
    h1.style.opacity = "0";
    hour.appendChild(h1);

    const h2 = document.createElement("div");
    h2.classList.add("h2");
    h2.innerHTML = "0";
    h2.style.opacity = "0";
    hour.appendChild(h2);

    const colon = document.createElement("div");
    colon.classList.add("colon");
    colon.innerText = ":";
    time.appendChild(colon);

    const minute = document.createElement("div");
    minute.classList.add("minute");
    time.appendChild(minute);

    const m1 = document.createElement("div");
    m1.classList.add("m1");
    m1.innerHTML = "0";
    m1.style.opacity = "0";
    minute.appendChild(m1);

    const m2 = document.createElement("div");
    m2.classList.add("m2");
    m2.innerHTML = "0";
    m2.style.opacity = "0";
    minute.appendChild(m2);

    const am = document.createElement("div");
    am.classList.add("meridiem", "am");
    am.innerText = "am";
    am.style.opacity = "0";
    this.view.appendChild(am);

    const pm = document.createElement("div");
    pm.classList.add("meridiem", "pm");
    pm.innerText = "pm";
    pm.style.opacity = "0";
    this.view.appendChild(pm);
  }
}
