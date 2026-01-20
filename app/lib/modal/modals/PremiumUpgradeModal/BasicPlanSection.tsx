import styles from "./PremiumUpgradeModal.module.css";

const basicFeatures = ["40 Exercises", "Concept Library", "30 mins of AI support"];

export function BasicPlanSection() {
  return (
    <div className={styles.leftSide}>
      <h1 className={styles.mainHeading}>
        <span className={styles.highlight}>Accelerate</span> your learning!
      </h1>
      <p className={styles.mainSubheading}>Upgrade to Premium and get personalised support when you need it most</p>

      <div className={styles.planSection}>
        <h2 className={styles.planName}>Basic Plan</h2>
        <p className={styles.planPrice}>Free forever</p>
        <ul className={styles.planFeatures}>
          {basicFeatures.map((feature, index) => (
            <li key={index}>
              <CheckIcon />
              {feature}
            </li>
          ))}
        </ul>
        <p className={styles.planNote}>
          + access to basic tutorials and community forums for additional learning resources.
        </p>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
