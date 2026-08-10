"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { useInView } from "../../hooks/useInView";
import { INITIAL_STATE, reducedMotionState, reducer } from "./state";
import { SPEED, TIMELINE } from "./timeline";

/** Fraction of the block that has to be on screen before the video starts. */
const START_THRESHOLD = 0.25;

/** Deterministic, so it is computed once rather than on every render. */
const REDUCED_MOTION_STATE = reducedMotionState();

/**
 * Drives the video: schedules the prebuilt timeline once the block scrolls into view, loops it,
 * and tears everything down when the section leaves or the tab is hidden.
 *
 * Pausing on tab-hide matters: background tabs clamp timers to ~1s while CSS transitions keep
 * their own clock, so a timeline left running in a hidden tab drifts out of step with the
 * animations it drives and comes back mid-garbage. The prototype missed this. Stopping and
 * restarting from the top is both cheaper and correct.
 */
export function useVideoTimeline() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { ref: rootRef, inView } = useInView<HTMLDivElement>(START_THRESHOLD);
  const timersRef = useRef<number[]>([]);
  /**
   * Bumped once per loop so the progress bar remounts and its animation replays from zero.
   * Deliberately not a dependency of the scheduling effect — re-running that on every loop would
   * tear down the timers it had just scheduled.
   */
  const [loopKey, setLoopKey] = useState(0);

  // A live query rather than a one-off read: the prototype only checked at boot, so toggling the
  // OS setting did nothing until a reload.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    // Reduced motion holds a still frame, so there is nothing to schedule.
    if (!inView || reducedMotion) return;

    const timers = timersRef.current;
    const clearTimers = () => {
      timers.forEach(clearTimeout);
      timers.length = 0;
    };

    /**
     * `fromCold` distinguishes a start that follows nothing from one loop handing over to the
     * next. Looping keeps whatever the closing frame left up, because the first beats are written
     * to take it from there — the cards fade out over the opening of the new run. A cold start has
     * no such continuity: without the rewind it would open on the previous run's finale, frozen
     * wherever the timeline was abandoned, and only tidy itself up ~500ms in.
     */
    const play = (fromCold = false) => {
      clearTimers();
      if (fromCold) dispatch({ type: "rewind" });
      setLoopKey((key) => key + 1);
      TIMELINE.beats.forEach((beat) => {
        timers.push(window.setTimeout(() => dispatch(beat.action), beat.at / SPEED));
      });
      // Wrapped rather than passed bare: `setTimeout` hands the callback its timer id, which
      // would arrive as a truthy `fromCold` and rewind on every loop.
      timers.push(window.setTimeout(() => play(), TIMELINE.duration / SPEED));
    };

    // Hidden tabs desync the timeline from its CSS, so restart from the top on return rather
    // than letting a throttled run drift.
    const onVisibility = () => {
      if (document.hidden) {
        clearTimers();
      } else {
        play(true);
      }
    };

    if (!document.hidden) play(true);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimers();
    };
  }, [inView, reducedMotion]);

  return {
    rootRef,
    state: reducedMotion ? REDUCED_MOTION_STATE : state,
    reducedMotion,
    loopKey,
    dispatch
  };
}
