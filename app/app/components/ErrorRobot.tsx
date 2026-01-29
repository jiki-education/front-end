import styles from "./ErrorRobot.module.css";

interface ErrorRobotProps {
  variant: "notFound" | "serverError";
}

export function ErrorRobot({ variant }: ErrorRobotProps) {
  const isError = variant === "serverError";
  const eyeClass = isError ? styles.eyeError : styles.eye;
  const floatingSymbol = isError ? "!" : "?";
  const floatingClass = isError ? styles.exclamation : styles.questionMark;

  return (
    <div className={styles.container}>
      <svg className={styles.robot} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Antenna */}
        <line className={styles.antenna} x1="100" y1="45" x2="100" y2="25" />
        <circle cx="100" cy="20" r="6" className={styles.antennaTop} />

        {/* Floating symbols */}
        <text className={floatingClass} x="70" y="25">
          {floatingSymbol}
        </text>
        <text className={floatingClass} x="120" y="20" style={{ animationDelay: "0.5s", fontSize: "18px" }}>
          {floatingSymbol}
        </text>
        <text className={floatingClass} x="135" y="35" style={{ animationDelay: "1s", fontSize: "16px" }}>
          {floatingSymbol}
        </text>

        {/* Robot head */}
        <rect className={styles.body} x="55" y="45" width="90" height="70" rx="12" />

        {/* Eyes */}
        <circle className={eyeClass} cx="80" cy="75" r="10" />
        <circle className={eyeClass} cx="120" cy="75" r="10" />
        {/* Pupils */}
        <circle cx={isError ? 80 : 83} cy={isError ? 75 : 73} r="4" fill="white" />
        <circle cx={isError ? 120 : 123} cy={isError ? 75 : 73} r="4" fill="white" />

        {/* Mouth */}
        <path
          d={isError ? "M82 98 Q100 90 118 98" : "M82 95 Q90 90 100 95 Q110 100 118 95"}
          className={styles.mouth}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Robot body */}
        <rect className={styles.body} x="60" y="120" width="80" height="50" rx="8" />

        {/* Chest indicator light */}
        <circle cx="100" cy="140" r="6" className={isError ? styles.chestLightError : styles.chestLight}>
          <animate
            attributeName="opacity"
            values="0.4;1;0.4"
            dur={isError ? "0.8s" : "1.5s"}
            repeatCount="indefinite"
          />
        </circle>

        {/* Arms */}
        <rect
          className={styles.body}
          x="30"
          y={isError ? 125 : 120}
          width="20"
          height="35"
          rx="6"
          transform={isError ? undefined : "rotate(-15 40 137)"}
        />
        <rect
          className={styles.body}
          x="150"
          y={isError ? 125 : 120}
          width="20"
          height="35"
          rx="6"
          transform={isError ? undefined : "rotate(15 160 137)"}
        />
      </svg>
    </div>
  );
}
