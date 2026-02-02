import styles from "./robots.module.css";

export default function ErrorRobot() {
  return (
    <div className={styles.robotContainer}>
      <svg className={styles.robot} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Antenna */}
        <line className={styles.antenna} x1="100" y1="45" x2="100" y2="25" />
        <circle cx="100" cy="20" r="6" fill="var(--color-gray-400)" />

        {/* Sparks around antenna */}
        <circle className={styles.spark} cx="85" cy="15" r="3" />
        <circle className={`${styles.spark} ${styles.sparkDelay1}`} cx="115" cy="18" r="2.5" />
        <circle className={`${styles.spark} ${styles.sparkDelay2}`} cx="108" cy="8" r="2" />

        {/* Robot head */}
        <rect className={styles.body} x="55" y="45" width="90" height="70" rx="12" />

        {/* Eyes */}
        <circle className={styles.eyeOff} cx="80" cy="75" r="10" />
        <circle className={styles.eyeFlicker} cx="120" cy="75" r="10" />

        {/* Mouth - grimacing expression */}
        <rect x="85" y="93" width="30" height="9" rx="2" fill="white" stroke="var(--color-gray-400)" strokeWidth="2" />
        <line x1="92" y1="93" x2="92" y2="102" stroke="var(--color-gray-400)" strokeWidth="1.5" />
        <line x1="100" y1="93" x2="100" y2="102" stroke="var(--color-gray-400)" strokeWidth="1.5" />
        <line x1="108" y1="93" x2="108" y2="102" stroke="var(--color-gray-400)" strokeWidth="1.5" />

        {/* Robot body */}
        <rect className={styles.body} x="60" y="120" width="80" height="50" rx="8" />

        {/* Chest indicator light - warning */}
        <circle cx="100" cy="140" r="6" className={styles.warningLight} />

        {/* Arms */}
        <rect className={styles.body} x="35" y="125" width="20" height="35" rx="6" />
        <rect className={styles.body} x="145" y="125" width="20" height="35" rx="6" />

        {/* Disconnected cable */}
        <path className={styles.cable} d="M165 145 Q185 145 190 160 Q195 180 175 185" />
        <rect className={styles.cableEnd} x="170" y="182" width="12" height="8" rx="2" />
        <circle cx="173" cy="186" r="2" fill="var(--color-gray-400)" />
        <circle cx="179" cy="186" r="2" fill="var(--color-gray-400)" />
      </svg>
    </div>
  );
}
