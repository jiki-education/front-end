"use client";

import { showModal } from "@/lib/modal";
import styles from "./page.module.css";

// Copy is resolved from the locale's curriculum copy catalog by slug, so these
// are slugs only.
const SAMPLE_CHALLENGES = [{ slug: "matching-socks" }, { slug: "structured-house" }, { slug: "space-invaders" }];

export default function ChallengeUnlockedModalDevPage() {
  const trigger = (challenge: (typeof SAMPLE_CHALLENGES)[number]) => {
    showModal("exercise-completion-modal", {
      onGoToDashboard: () => console.debug("Go to dashboard clicked"),
      exerciseTitle: "Test Exercise",
      initialStep: "challenge-unlocked",
      unlockedChallenge: challenge
    });
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Challenge Unlocked Modal</h1>
      <p className={styles.subtitle}>Isolated dev page for testing the challenge-unlocked step.</p>

      <div className={styles.list}>
        {SAMPLE_CHALLENGES.map((challenge) => (
          <div key={challenge.slug} className={styles.row}>
            <div>
              <div className={styles.name}>{challenge.slug}</div>
            </div>
            <button onClick={() => trigger(challenge)} className={styles.triggerButton}>
              Trigger modal
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
