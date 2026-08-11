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
 * Drives the video: schedules the prebuilt timeline once the block scrolls into view, loops it, and
 * tears down when the section leaves or the tab hides (a hidden tab clamps timers and desyncs the CSS).
 */
export function useVideoTimeline({ paused = false }: { paused?: boolean } = {}) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { ref: rootRef, inView } = useInView<HTMLDivElement>(START_THRESHOLD);
  const timersRef = useRef<number[]>([]);
  // Bumped once per loop so the progress bar remounts and replays; not a scheduling-effect dependency.
  const [loopKey, setLoopKey] = useState(0);

  // A live query so toggling the OS setting takes effect without a reload.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    // Reduced motion holds a still frame and `paused` means the dev scrubber drives the state; nothing to schedule.
    if (!inView || reducedMotion || paused) return;

    const timers = timersRef.current;
    const clearTimers = () => {
      timers.forEach(clearTimeout);
      timers.length = 0;
    };

    // `fromCold` rewinds first: a cold start would otherwise open on the previous run's frozen finale,
    // whereas a loop handover is written to take over whatever the closing frame left up.
    const play = (fromCold = false) => {
      clearTimers();
      if (fromCold) dispatch({ type: "rewind" });
      setLoopKey((key) => key + 1);
      TIMELINE.beats.forEach((beat) => {
        timers.push(window.setTimeout(() => dispatch(beat.action), beat.at / SPEED));
      });
      // Wrapped so `setTimeout`'s timer-id argument doesn't arrive as a truthy `fromCold`.
      timers.push(window.setTimeout(() => play(), TIMELINE.duration / SPEED));
    };

    // Hidden tabs desync the timeline from its CSS, so restart from the top on return.
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
  }, [inView, reducedMotion, paused]);

  return {
    rootRef,
    state: reducedMotion ? REDUCED_MOTION_STATE : state,
    reducedMotion,
    loopKey,
    dispatch
  };
}
