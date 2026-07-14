import type { Animation as CurriculumAnimation } from "@jiki/curriculum";
import { TIME_SCALE_FACTOR, type Frame } from "@jiki/interpreters/shared";
import {
  createTimeline,
  type AnimationParams,
  type DefaultsParams,
  type TargetsParam,
  type Timeline,
  type TimelinePosition
} from "animejs";

export class AnimationTimeline {
  // Null after destroy(): callers can outlive the timeline (e.g. a document-level
  // drag listener still firing while the exercise tears down), so playback
  // methods no-op once destroyed instead of dereferencing null.
  private animationTimeline: Timeline | null;
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
    this.animationTimeline?.pause();
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
    if (!this.animationTimeline) {
      return this;
    }
    const timeline = this.animationTimeline;
    animations.forEach((animation) => {
      const { targets, offset, transformations, duration, easing, modifier } = animation;

      // Combine duration/easing with transformations to create AnimationParams
      const params: AnimationParams = {
        ...transformations,
        ...(duration !== undefined && { duration }),
        ...(easing !== undefined && { easing }),
        ...(modifier !== undefined && { modifier })
      };

      timeline.add(targets as TargetsParam, params, offset as TimelinePosition);
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

    const animationDurationAfterAnimations = timeline.duration;
    const lastFrame = frames[frames.length - 1];

    // ESLint doesn't realize lastFrame can be undefined when frames array is empty
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const lastFrameTime = lastFrame ? lastFrame.timeInMs : 0;
    timeline.duration = Math.max(animationDurationAfterAnimations, lastFrameTime);
    return this;
  }

  public get duration() {
    // Translate this back to microseconds
    return (this.animationTimeline?.duration ?? 0) * TIME_SCALE_FACTOR;
  }

  // public seekEndOfTimeline() {
  //   this.animationTimeline.seek(this.animationTimeline.duration);
  // }

  public seek(time: number, muteCallbacks = false) {
    // Convert microseconds to milliseconds for AnimeJS. Pass the fractional
    // value through — anime.js accepts non-integer ms. Rounding here would
    // collapse sub-millisecond frame times to 0 and skip past animations
    // whose offsets fall inside that range (e.g. exercises like digital-clock
    // that operate at microsecond granularity).
    this.animationTimeline?.seek(time / TIME_SCALE_FACTOR, muteCallbacks);
  }

  public play(cb?: () => void) {
    if (cb) {
      cb();
    }
    this.animationTimeline?.play();
  }

  public pause(cb?: () => void) {
    this.animationTimeline?.pause();
    if (cb) {
      cb();
    }
  }

  public get paused(): boolean {
    return this.animationTimeline?.paused ?? true;
  }

  public get completed(): boolean {
    return this.animationTimeline?.completed ?? false;
  }
}
