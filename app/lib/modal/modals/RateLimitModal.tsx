"use client";

import { useEffect, useState } from "react";
import styles from "./RateLimitModal.module.css";

export function RateLimitModal() {
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto-refresh logic would go here
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const dashOffset = 125.6 - (125.6 * timeLeft) / 15;

  return (
    <div className={styles.container}>
      <div className={styles.logo}>JIKI</div>

      <div className={styles.robotContainer}>
        <TiredRobotSvg />
      </div>

      <h1 className={styles.title}>You&apos;ve moved too fast.</h1>
      <p className={styles.subtitle}>
        You&apos;ve sent too many requests to our servers and so we&apos;re putting you on pause for a few seconds.
        Please wait and you&apos;ll be automatically reconnected.
      </p>

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
            Reconnecting in <span>{timeLeft}</span> seconds
          </div>
          <div className={styles.statusSubtext}>This page will automatically refresh</div>
        </div>
      </div>

      <p className={styles.helpText}>
        <strong>Note:</strong> Opening new tabs or making additional requests will extend your wait time.
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
