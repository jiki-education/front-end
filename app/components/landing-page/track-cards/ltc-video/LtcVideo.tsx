"use client";

import { useTranslations } from "next-intl";
import { Callout } from "./Callout";
import { CodeEditor } from "./CodeEditor";
import { ExercisePane } from "./ExercisePane";
import { PanelTabs } from "./PanelTabs";
import { Confetti, Cursor, ErrorCallout, SuccessModal } from "./StageOverlays";
import { PlayIcon, ResetIcon } from "./icons";
import { LEFT_CALLOUTS, RIGHT_CALLOUTS } from "./strings";
import { SPEED, TIMELINE } from "./timeline";
import type { VideoState } from "./state";
import { useVideoTimeline } from "./useVideoTimeline";
import styles from "./LtcVideo.module.css";

/**
 * The "Learn to Code" walkthrough — not a video but the app drawn in DOM and animated on a scripted
 * timeline, so it translates across 50+ locales where one screencast per locale wouldn't be viable.
 */
export function LtcVideo({ frozenState }: { frozenState?: VideoState } = {}) {
  const t = useTranslations("landing.learnToCode.demo");
  // `/dev/ltc-video` scrubs by handing a state in directly, which also pauses the scheduler.
  const timeline = useVideoTimeline({ paused: frozenState !== undefined });
  const { rootRef, reducedMotion, loopKey, dispatch } = timeline;
  const state = frozenState ?? timeline.state;

  const demoClasses = [
    styles.demo,
    state.finale || state.finaleFading ? styles.finale : "",
    state.emphasis === "glow" ? styles.allGlow : "",
    state.emphasis === "lit" ? styles.allLit : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.root} ref={rootRef}>
      <div className={demoClasses}>
        <div className={`${styles.rail} ${styles.railLeft}`}>
          {LEFT_CALLOUTS.map((id) => (
            <Callout
              key={id}
              id={id}
              shown={state.finaleShown || state.callout === id}
              finale={state.finale || state.finaleFading}
            />
          ))}
        </div>

        <div className={styles.videoWrap}>
          {/* A picture of the app, not the app: hidden from assistive tech and described once here instead; the callout rails carry the same story as real content. */}
          <p className="sr-only">{t("stageDescription")}</p>
          <div className={styles.stage} lang="en" dir="ltr" aria-hidden="true">
            <div className={styles.left}>
              <div className={`${styles.card} ${styles.editorCard}`}>
                <CodeEditor state={state} />
                <div className={styles.runbar}>
                  <div className={styles.resetBtn}>
                    <ResetIcon />
                  </div>
                  <div className={`${styles.runBtn} ${state.runPressed ? styles.runBtnPressed : ""}`}>
                    <PlayIcon size={12} />
                    <span>{t("run")}</span>
                  </div>
                </div>
              </div>

              <ExercisePane state={state} onShotEnd={(id) => dispatch({ type: "expireShot", id })} />
            </div>

            <PanelTabs state={state} />

            <ErrorCallout shown={state.errorShown} />

            <div className={`${styles.modalScrim} ${state.scrimShown ? styles.modalScrimShown : ""}`} />
            <Confetti firing={state.confettiFiring} />
            <SuccessModal shown={state.scrimShown} />

            <Cursor state={state} />
          </div>

          {/* Progress through the video itself: page furniture, not part of the app. */}
          <div className={styles.videoProgress}>
            <i
              // Keyed on the loop so the fill restarts from zero each time round, no forced reflow.
              key={loopKey}
              className={reducedMotion ? styles.videoProgressFull : styles.videoProgressRunning}
              style={reducedMotion ? undefined : { animationDuration: `${TIMELINE.duration / SPEED}ms` }}
            />
          </div>
        </div>

        <div className={`${styles.rail} ${styles.railRight}`}>
          {RIGHT_CALLOUTS.map((id) => (
            <Callout
              key={id}
              id={id}
              shown={state.finaleShown || state.callout === id}
              finale={state.finale || state.finaleFading}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
