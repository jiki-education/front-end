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
import { useVideoTimeline } from "./useVideoTimeline";
import styles from "./LtcVideo.module.css";

/**
 * The "Learn to Code" walkthrough.
 *
 * It is not a video: the landing page ships in 50+ locales and one screencast per locale is not
 * viable, so the app is drawn in DOM and animated on a scripted timeline. Everything the learner
 * reads is live text, which is what makes it translatable.
 *
 * The timeline is a prebuilt array of `{ at, action }` dispatched into a reducer; CSS owns every
 * transition. That keeps the main thread doing one dispatch every ~145ms during the busiest
 * stretch, with the motion itself on the compositor.
 */
export function LtcVideo() {
  const t = useTranslations("landing.learnToCode.demo");
  const { rootRef, state, reducedMotion, loopKey, dispatch } = useVideoTimeline();

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
          {/* A picture of the app, not the app: nothing in here is operable, and read aloud it is
              a stream of interface chrome with no thread to follow. It is hidden from assistive
              tech and described once instead — the callout rails either side carry the same story
              as real content. `lang`/`dir` still matter for the sighted reading of the code. */}
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
              // Keyed on the loop so the fill restarts from zero each time round rather than
              // needing a forced reflow to interrupt the animation.
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
