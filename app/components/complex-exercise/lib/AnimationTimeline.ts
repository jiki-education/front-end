import {
  createTimeline,
  type AnimationParams,
  type DefaultsParams,
  type TargetsParam,
  type Timeline,
  type TimelinePosition
} from "animejs";
import { TIME_SCALE_FACTOR, type Frame } from "@jiki/interpreters";
import type { Animation as CurriculumAnimation } from "@jiki/curriculum";

export type Animation =
  | (AnimationParams & { targets?: TargetsParam })
  | {
      targets: TargetsParam;
      offset?: TimelinePosition;
      transformations: Partial<AnimationParams>;
    };

export class AnimationTimeline {
  private animationTimeline: Timeline;
  private updateCallbacks: ((anim: Timeline) => void)[] = [];
  private completeCallbacks: ((anim: Timeline) => void)[] = [];
  public hasPlayedOrScrubbed = false;

  constructor(initialOptions: DefaultsParams) {
    this.animationTimeline = createTimeline({
      defaults: {
        ease: "linear",
        ...initialOptions
      },
      autoplay: false,
      onUpdate: (anim: Timeline) => {
        this.updateCallbacks.forEach((cb) => cb(anim));
      },
      onComplete: (anim: Timeline) => {
        this.completeCallbacks.forEach((cb) => cb(anim));
      }
    });
  }

  public destroy() {
    this.animationTimeline.pause();
    // @ts-expect-error - Intentionally setting to null for cleanup
    this.animationTimeline = null;
  }

  public onUpdate(callback: (anim: Timeline) => void) {
    this.updateCallbacks.push(callback);
  }

  public clearUpdateCallbacks() {
    this.updateCallbacks = [];
  }

  public onComplete(callback: (anim: Timeline) => void) {
    this.completeCallbacks.push(callback);
  }

  public clearCompleteCallbacks() {
    this.completeCallbacks = [];
  }

  public populateTimeline(animations: CurriculumAnimation[], frames: Frame[] = []): this {
    animations.forEach((animation) => {
      const { targets, offset, transformations, duration, easing } = animation;

      // Combine duration/easing with transformations to create AnimationParams
      const params: AnimationParams = {
        ...transformations,
        ...(duration !== undefined && { duration }),
        ...(easing !== undefined && { easing })
      };

      this.animationTimeline.add(targets as TargetsParam, params, offset as TimelinePosition);
    });

    /*
     Ensure the last frame is included in the timeline duration, even if it's not an animation.
     anime timeline only cares about animations when calculating duration
     and if the last frame is not an animation, it will not be included in the duration.

     For example:
     - the total animation duration is 60ms
     - a new frame is added after the animation, incrementing time by 1ms (see Executor.addFrame - executor.ts#L868).
     - the last frame is now at time 61ms, but the timeline duration remains 60ms because the last frame is not animated.
     - this discrepancy prevents seeking to the last frame (time 61ms) as the timeline caps at 60ms.

     On the other hand ensure the full duration of the last animation is present. hence the max function.
    */

    const animationDurationAfterAnimations = this.animationTimeline.duration;
    const lastFrame = frames[frames.length - 1];

    // ESLint doesn't realize lastFrame can be undefined when frames array is empty
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const lastFrameTime = lastFrame ? lastFrame.timeInMs : 0;
    this.animationTimeline.duration = Math.max(animationDurationAfterAnimations, lastFrameTime);
    return this;
  }

  public get duration() {
    // Translate this back to microseconds
    return this.animationTimeline.duration * TIME_SCALE_FACTOR;
  }

  // public seekEndOfTimeline() {
  //   this.animationTimeline.seek(this.animationTimeline.duration);
  // }

  public seek(time: number) {
    // Convert microseconds to milliseconds for AnimeJS
    this.animationTimeline.seek(Math.round(time / TIME_SCALE_FACTOR));
  }

  public play(cb?: () => void) {
    // If we're at the end of the animation and hit play
    // then we want to restart it.
    if (this.completed) {
      this.animationTimeline.seek(0);
    }
    if (cb) {
      cb();
    }
    this.animationTimeline.play();
  }

  public pause(cb?: () => void) {
    this.animationTimeline.pause();
    if (cb) {
      cb();
    }
  }

  public get paused(): boolean {
    return this.animationTimeline.paused;
  }

  public get completed(): boolean {
    return this.animationTimeline.completed;
  }
}
