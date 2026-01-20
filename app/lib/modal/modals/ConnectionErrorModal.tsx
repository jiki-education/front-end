"use client";

import styles from "./ConnectionErrorModal.module.css";

export function ConnectionErrorModal() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>JIKI</div>

      <div className={styles.robotContainer}>
        <RobotSvg />
      </div>

      <h1 className={styles.title}>Whoops! Lost connection</h1>

      <p className={styles.subtitle}>
        Jiki got a little tangled up and dropped the connection. Don&apos;t worry though - we&apos;re working on getting
        things plugged back in!
      </p>

      <div className={styles.statusCard}>
        <div className={styles.spinner} />
        <span className={styles.statusText}>
          Reconnecting
          <span className={styles.dots} />
        </span>
      </div>

      <p className={styles.helpText}>
        Just sit tight - this usually fixes itself in a few moments.
        <br />
        If the problem persists,{" "}
        <a href="#" className={styles.statusLink}>
          check our status page
        </a>
        .
      </p>
    </div>
  );
}

function RobotSvg() {
  return (
    <svg className={styles.robot} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Antenna */}
      <line className={styles.robotAntenna} x1="100" y1="45" x2="100" y2="25" />
      <circle cx="100" cy="20" r="6" fill="#94a3b8" />

      {/* Sparks around antenna */}
      <circle className={styles.spark} cx="85" cy="15" r="3" />
      <circle className={styles.spark} cx="115" cy="18" r="2.5" />
      <circle className={styles.spark} cx="108" cy="8" r="2" />

      {/* Robot head */}
      <rect className={styles.robotBody} x="55" y="45" width="90" height="70" rx="12" />

      {/* Eyes */}
      <circle className={`${styles.robotEye} ${styles.off}`} cx="80" cy="75" r="10" />
      <circle className={styles.robotEye} cx="120" cy="75" r="10">
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Mouth - grimacing expression */}
      <rect x="85" y="93" width="30" height="9" rx="2" fill="white" stroke="#94a3b8" strokeWidth="2" />
      <line x1="92" y1="93" x2="92" y2="102" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="100" y1="93" x2="100" y2="102" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="108" y1="93" x2="108" y2="102" stroke="#94a3b8" strokeWidth="1.5" />

      {/* Robot body */}
      <rect className={styles.robotBody} x="60" y="120" width="80" height="50" rx="8" />

      {/* Chest indicator light */}
      <circle cx="100" cy="140" r="6" fill="#fbbf24">
        <animate attributeName="opacity" values="1;0.4;1" dur="1s" repeatCount="indefinite" />
      </circle>

      {/* Arms */}
      <rect className={styles.robotBody} x="35" y="125" width="20" height="35" rx="6" />
      <rect className={styles.robotBody} x="145" y="125" width="20" height="35" rx="6" />

      {/* Disconnected cable */}
      <path className={styles.cable} d="M165 145 Q185 145 190 160 Q195 180 175 185" />
      <rect className={styles.cableEnd} x="170" y="182" width="12" height="8" rx="2" />
      <circle cx="173" cy="186" r="2" fill="#94a3b8" />
      <circle cx="179" cy="186" r="2" fill="#94a3b8" />
    </svg>
  );
}
