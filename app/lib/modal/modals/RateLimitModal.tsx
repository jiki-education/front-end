"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { hasRecentlyAutoReloaded, recordAutoReload } from "./rateLimitReload";
import styles from "./RateLimitModal.module.css";

interface RateLimitModalProps {
  retryAfterSeconds?: number;
}

/**
 * Matches the API client's own fallback for a 429 with no Retry-After header
 * (see parseRetryAfter). They used to disagree, and this one was shorter, so the
 * modal reloaded back into a block that had not expired yet.
 */
const DEFAULT_RETRY_AFTER_SECONDS = 60;

/**
 * The "you have been rate limited" gate: count down whatever the server asked
 * for, then get the visitor moving again.
 *
 * It reloads the page ONCE. A reload is a hundred-odd requests, so a modal that
 * reloads on every countdown spends the budget it is waiting for and blocks the
 * load it just triggered, refreshing forever and holding the limit open. After
 * that one attempt the visitor gets a button instead, so the next reload is
 * theirs to time. See rateLimitReload.ts.
 */
export function RateLimitModal({ retryAfterSeconds = DEFAULT_RETRY_AFTER_SECONDS }: RateLimitModalProps) {
  const t = useTranslations("modals.rateLimit");
  const tCommon = useTranslations("common");
  const [timeLeft, setTimeLeft] = useState(retryAfterSeconds);
  // Read once, on mount. Read during the countdown instead and the marker this
  // very modal is about to write would flip the answer under it.
  const [canAutoReload] = useState(() => !hasRecentlyAutoReloaded());

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft((prev) => Math.max(prev - 1, 0)), 1000);
    return () => clearInterval(interval);
  }, [retryAfterSeconds]);

  // Acting on the countdown lives outside the tick, so the tick stays a pure
  // state update and reloading can never be a side effect of a re-run updater.
  useEffect(() => {
    if (timeLeft > 0 || !canAutoReload) {
      return;
    }
    recordAutoReload();
    window.location.reload();
  }, [timeLeft, canAutoReload]);

  // A manual reload is the visitor's own decision and is deliberately NOT
  // recorded: what is bounded here is what the page does on its own.
  const reloadNow = () => window.location.reload();

  const waitedOut = timeLeft === 0 && !canAutoReload;
  const dashOffset = 125.6 - (125.6 * timeLeft) / retryAfterSeconds;

  return (
    <div className={styles.container}>
      <div className={styles.logo}>JIKI</div>

      <div className={styles.robotContainer}>
        <TiredRobotSvg />
      </div>

      <h1 className={styles.title}>{t("title")}</h1>
      <p className={styles.subtitle}>{waitedOut ? t("manualSubtitle") : t("subtitle")}</p>

      {waitedOut ? (
        <div className={styles.statusCard}>
          <div>
            <div className={styles.statusText}>{t("manualRefresh")}</div>
            <button type="button" onClick={reloadNow} className={`ui-btn ui-btn-small ui-btn-primary ${styles.reload}`}>
              {tCommon("reloadPage")}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.statusCard}>
          <div className={styles.timerRing}>
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle className={styles.bg} cx="24" cy="24" r="20" fill="none" strokeWidth="4" />
              <circle
                className={styles.progress}
                cx="24"
                cy="24"
                r="20"
                fill="none"
                strokeWidth="4"
                strokeDasharray="125.6"
                strokeDashoffset={dashOffset}
              />
            </svg>
            <span className={styles.timerNumber}>{timeLeft}</span>
          </div>
          <div>
            <div className={styles.statusText}>
              {t.rich("reconnecting", { count: timeLeft, timer: (chunks) => <span>{chunks}</span> })}
            </div>
            <div className={styles.statusSubtext}>{t("autoRefresh")}</div>
          </div>
        </div>
      )}

      <p className={styles.helpText}>
        <strong>{t("noteLabel")}</strong> {t("noteText")}
      </p>
    </div>
  );
}

function TiredRobotSvg() {
  return (
    <svg className={styles.robot} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className={styles.robotHeadGroup}>
        {/* Antenna */}
        <line className={styles.robotAntenna} x1="100" y1="45" x2="100" y2="25" />
        <circle cx="100" cy="20" r="6" fill="#94a3b8" />

        {/* Robot head */}
        <rect className={styles.robotBody} x="55" y="45" width="90" height="70" rx="12" />

        {/* Tired eyes with half-closed lids */}
        <circle className={`${styles.robotEye} ${styles.tired}`} cx="80" cy="75" r="10" />
        <circle className={`${styles.robotEye} ${styles.tired}`} cx="120" cy="75" r="10" />

        {/* Droopy eyelids */}
        <ellipse className={styles.eyeLid} cx="80" cy="70" rx="12" ry="8" />
        <ellipse className={styles.eyeLid} cx="120" cy="70" rx="12" ry="8" />

        {/* Tired mouth - slight frown */}
        <path d="M85 95 Q100 90 115 95" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Sweat drop */}
        <path className={styles.sweat} d="M140 55 Q145 60 140 68 Q135 60 140 55" />

        {/* Z's floating up */}
        <text className={`${styles.zzz} ${styles.zzz1}`} x="145" y="45" fontSize="14">
          z
        </text>
        <text className={`${styles.zzz} ${styles.zzz2}`} x="155" y="35" fontSize="12">
          z
        </text>
        <text className={`${styles.zzz} ${styles.zzz3}`} x="163" y="25" fontSize="10">
          z
        </text>
      </g>

      {/* Robot body */}
      <g className={styles.robotChest}>
        <rect className={styles.robotBody} x="60" y="120" width="80" height="50" rx="8" />

        {/* Chest indicator light - pulsing amber for warning */}
        <circle cx="100" cy="140" r="6" fill="#f59e0b">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Arms hanging down tiredly */}
      <rect className={styles.robotBody} x="35" y="128" width="20" height="35" rx="6" transform="rotate(5 45 128)" />
      <rect className={styles.robotBody} x="145" y="128" width="20" height="35" rx="6" transform="rotate(-5 155 128)" />
    </svg>
  );
}
