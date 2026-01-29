import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Account Deleted - Jiki"
};

export default function AccountDeletedPage() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>JIKI</div>

      <div className={styles.robotContainer}>
        <RobotIllustration />
      </div>

      <h1 className={styles.title}>Your account has been deleted</h1>
      <p className={styles.subtitle}>
        We&apos;re sorry to see you go. We hope you&apos;ve enjoyed Jiki. Good luck with your coding journey!
      </p>
    </div>
  );
}

function RobotIllustration() {
  return (
    <svg className={styles.robot} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Antenna */}
      <line className={styles.robotAntenna} x1="100" y1="45" x2="100" y2="25" />
      <circle cx="100" cy="20" r="6" fill="#94a3b8" />

      {/* Robot head */}
      <rect className={styles.robotBody} x="55" y="45" width="90" height="70" rx="12" />

      {/* Eyes - sad/closed */}
      <path d="M75 70 Q80 78 85 70" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M115 70 Q120 78 125 70" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Mouth - sad */}
      <path d="M85 95 Q100 88 115 95" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Robot body */}
      <rect className={styles.robotBody} x="60" y="120" width="80" height="50" rx="8" />

      {/* Chest indicator light - dim */}
      <circle cx="100" cy="140" r="6" fill="#94a3b8">
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Left arm - down */}
      <rect className={styles.robotBody} x="30" y="125" width="20" height="35" rx="6" />

      {/* Right arm - raised up waving */}
      <g className={styles.waveHand}>
        <rect
          className={styles.robotBody}
          x="154"
          y="103"
          width="18"
          height="30"
          rx="6"
          transform="rotate(45 163 118)"
        />
      </g>
    </svg>
  );
}
