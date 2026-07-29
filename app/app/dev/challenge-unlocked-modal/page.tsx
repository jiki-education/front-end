"use client";

import { showModal } from "@/lib/modal";
import styles from "./page.module.css";

const SAMPLE_CHALLENGES = [
  {
    name: "Space Invaders",
    description: "Build a classic arcade game with aliens, lasers, and defensive barriers.",
    slug: "space-invaders"
  },
  {
    name: "Todo App",
    description: "Create a full-featured task manager with filtering, priorities, and persistence.",
    slug: "todo-app"
  },
  {
    name: "Weather Dashboard",
    description: "Fetch and display live weather data with charts and forecasts.",
    slug: "weather-dashboard"
  }
];

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
              <div className={styles.name}>{challenge.name}</div>
              <div className={styles.description}>{challenge.description}</div>
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
