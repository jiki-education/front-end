import styles from "./Exercism.module.css";
import shared from "./shared.module.css";

export function Exercism() {
  return (
    <section className={styles.exercism}>
      <div className={shared["lg-container"]}>
        <h2>What makes Exercism special?</h2>
        <p className={`${styles.intro} text-balance`}>
          Exercism is a <strong className="font-medium">longstanding nonprofit</strong> that&apos;s helped over{" "}
          <strong className="font-medium whitespace-nowrap">2.5 million people</strong> level-up their coding skills.
        </p>
        <ul>
          <li>
            <div className={styles.emoji}>🧑‍💻</div>
            <div className={styles.count}>2,500,000</div>
            <div className={styles.title}>Exercism students</div>
            <p>We&apos;ve grown entirely by word of mouth. Good friends tell their friends about Exercism!</p>
          </li>
          <li>
            <div className={styles.emoji}>👏</div>
            <div className={styles.count}>85,000</div>
            <div className={styles.title}>Testimonials</div>
            <p>We&apos;ve been one of the most trusted resources for coding education for over a decade.</p>
          </li>
          <li>
            <div className={styles.emoji}>🧩</div>
            <div className={styles.count}>47,082,260</div>
            <div className={styles.title}>Exercises Solved</div>
            <p>Our exercises are trusted by the coding community as the perfect way to level up!</p>
          </li>
          <li>
            <div className={styles.emoji}>👯</div>
            <div className={styles.count}>384,906</div>
            <div className={styles.title}>Mentoring Sessions</div>
            <p>Our unique mentoring program is one of the best ways to get tips from experts!</p>
          </li>
        </ul>
      </div>
    </section>
  );
}
