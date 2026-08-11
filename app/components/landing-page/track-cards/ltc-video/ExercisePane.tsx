import { useTranslations } from "next-intl";
import { GameCanvas } from "./GameCanvas";
import { ChevronIcon, PlayIcon } from "./icons";
import type { VideoState } from "./state";
import { SPEED } from "./timeline";
import styles from "./LtcVideo.module.css";

/** The lower-left card: scenario copy and verdict, the game canvas, and the scrubber underneath. */
export function ExercisePane({ state, onShotEnd }: { state: VideoState; onShotEnd: (id: number) => void }) {
  return (
    <div className={`${styles.card} ${styles.exercise}`}>
      <div className={styles.exerciseBody}>
        <Scenario outcome={state.outcome} />
        <GameCanvas state={state} onShotEnd={onShotEnd} />
      </div>
      <Scrubber state={state} />
    </div>
  );
}

/** The scenario copy and its verdict: amber pending, red fail, green pass. */
function Scenario({ outcome }: { outcome: VideoState["outcome"] }) {
  const t = useTranslations("landing.learnToCode.demo");
  const badgeKey = outcome === "pass" ? "badgePass" : outcome === "fail" ? "badgeFail" : "badgePending";
  const verdictKey = outcome === "pass" ? "verdictPass" : outcome === "fail" ? "verdictFail" : "verdictPending";

  return (
    <div
      className={`${styles.scenario} ${outcome === "fail" ? styles.scenarioFail : ""} ${
        outcome === "pass" ? styles.scenarioPass : ""
      }`}
    >
      {/* Drawn scenery, so deliberately not a real heading — see the modal title. */}
      <div className={styles.scenarioTitle}>{t("scenarioTitle")}</div>
      <span className={styles.badge}>{t(badgeKey)}</span>
      <p className={styles.verdict}>{t(verdictKey)}</p>
    </div>
  );
}

/** The scrubber strip. Fill and thumb move on `transform`, so the sweep composites rather than laying out. */
function Scrubber({ state }: { state: VideoState }) {
  return (
    <div className={styles.scrubber}>
      <div className={styles.play}>
        <PlayIcon size={10} />
      </div>
      <div
        className={styles.track}
        style={{ "--progress": state.trackPct, "--track-ms": `${state.trackMs / SPEED}ms` } as React.CSSProperties}
      >
        <i />
        <div className={styles.thumbRail}>
          <b />
        </div>
      </div>
      <div className={styles.step}>
        <ChevronIcon dir="left" />
      </div>
      <div className={styles.step}>
        <ChevronIcon dir="right" />
      </div>
    </div>
  );
}
