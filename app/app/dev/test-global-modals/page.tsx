"use client";

import { showConfirmation, showInfo, showModal } from "@/lib/modal";
import { AppModalRegistrar } from "@/lib/modal/AppModalRegistrar";
import { showDeepDivesUpsell, showNeverGetStuckUpsell, showPremiumChallengesUpsell } from "@/lib/modal/app";
import styles from "./page.module.css";

export default function TestGlobalModals() {
  return (
    <div className={styles.page}>
      {/* (app)-only modals aren't registered in the /dev layout; register them here so they're testable */}
      <AppModalRegistrar />
      <h1 className={styles.title}>Global Modal System Test</h1>

      <div className={styles.intro}>
        <p className={styles.introText}>
          These modals can be called from anywhere in the app without any setup or context providers. Just import and
          call the functions!
        </p>
      </div>

      <div className={styles.sections}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Example Modal</h2>
          <button
            onClick={() =>
              showModal("example-modal", {
                title: "Global Example",
                message: "This modal is called globally without any orchestrator!"
              })
            }
            className={styles.modalButton}
            data-color="purple"
          >
            Show Example Modal
          </button>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Confirmation Modal</h2>
          <button
            onClick={() =>
              showConfirmation({
                title: "Delete Item",
                message: "Are you sure you want to delete this item? This action cannot be undone.",
                confirmText: "Delete",
                cancelText: "Cancel",
                variant: "danger",
                onConfirm: () => alert("Item deleted!"),
                onCancel: () => alert("Cancelled")
              })
            }
            className={styles.modalButton}
            data-color="red"
          >
            Show Confirmation Modal
          </button>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Info Modal</h2>
          <button
            onClick={() =>
              showInfo({
                title: "System Information",
                content: (
                  <div className={styles.infoContent}>
                    <p>The global modal system provides:</p>
                    <ul className={styles.infoList}>
                      <li>Simple API - just import and use</li>
                      <li>No context providers needed at component level</li>
                      <li>Works from any page or component</li>
                      <li>TypeScript support</li>
                      <li>Customizable modal types</li>
                    </ul>
                  </div>
                ),
                buttonText: "Awesome!"
              })
            }
            className={styles.modalButton}
            data-color="blue"
          >
            Show Info Modal
          </button>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Custom Props</h2>
          <button
            onClick={() =>
              showModal("example-modal", {
                title: "Custom Title",
                message: "You can pass any props to your modals!"
              })
            }
            className={styles.modalButton}
            data-color="green"
          >
            Show Modal with Custom Props
          </button>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Connection Error Modal</h2>
          <button
            onClick={() => showModal("connection-error-modal")}
            className={styles.modalButton}
            data-color="orange"
          >
            Show Connection Error Modal
          </button>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Rate Limit Modal</h2>
          <button onClick={() => showModal("rate-limit-modal")} className={styles.modalButton} data-color="amber">
            Show Rate Limit Modal
          </button>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Auth Error Modal</h2>
          <button onClick={() => showModal("auth-error-modal")} className={styles.modalButton} data-color="red">
            Show Auth Error Modal
          </button>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Premium Upsell Modals</h2>
          <div className={styles.buttonGroup}>
            <button
              onClick={() => showNeverGetStuckUpsell({ trigger: "exercise_completion" })}
              className={styles.modalButton}
              data-color="purple"
            >
              Never Get Stuck
            </button>
            <button
              onClick={() => showPremiumChallengesUpsell({ trigger: "exercise_completion" })}
              className={styles.modalButton}
              data-color="purple"
            >
              Premium Challenges
            </button>
            <button
              onClick={() => showDeepDivesUpsell({ trigger: "exercise_completion" })}
              className={styles.modalButton}
              data-color="purple"
            >
              Deep Dives
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Exercise Completion Modal</h2>
          <div className={styles.buttonGroup}>
            <button
              onClick={() =>
                showModal("exercise-completion-modal", {
                  onTidyCode: () => console.debug("Tidy code clicked"),
                  onCompleteExercise: () => {
                    console.debug("Complete exercise clicked");
                    return Promise.resolve([]);
                  },
                  onGoToDashboard: () => console.debug("Go to dashboard clicked"),
                  exerciseTitle: "Test Exercise",
                  initialStep: "success"
                })
              }
              className={styles.modalButton}
              data-color="emerald"
            >
              Success Step
            </button>

            <button
              onClick={() =>
                showModal("exercise-completion-modal", {
                  onTidyCode: () => console.debug("Tidy code clicked"),
                  onCompleteExercise: () => {
                    console.debug("Complete exercise clicked");
                    return Promise.resolve([]);
                  },
                  onGoToDashboard: () => console.debug("Go to dashboard clicked"),
                  exerciseTitle: "Navigate the Maze",
                  initialStep: "difficulty-rating"
                })
              }
              className={styles.modalButton}
              data-color="purple"
            >
              🆕 Rating Step (Difficulty + Fun)
            </button>

            <button
              onClick={() =>
                showModal("exercise-completion-modal", {
                  onTidyCode: () => console.debug("Tidy code clicked"),
                  onCompleteExercise: () => {
                    console.debug("Complete exercise clicked");
                    return Promise.resolve([]);
                  },
                  onGoToDashboard: () => console.debug("Go to dashboard clicked"),
                  exerciseTitle: "Test Exercise",
                  initialStep: "completed"
                })
              }
              className={styles.modalButton}
              data-color="green"
            >
              Completed Step
            </button>

            <button
              onClick={() =>
                showModal("exercise-completion-modal", {
                  onGoToDashboard: () => console.debug("Go to dashboard clicked"),
                  exerciseTitle: "Test Exercise",
                  initialStep: "challenge-unlocked",
                  unlockedChallenge: { slug: "matching-socks" }
                })
              }
              className={styles.modalButton}
              data-color="pink"
            >
              Challenge Unlocked Step
            </button>
          </div>
          <p className={styles.groupNote}>
            🆕 Test the new combined rating step! Click through the full flow: Success → Confirmation → Rate Experience
            (Difficulty + Fun) → Completed
          </p>
        </div>
      </div>

      <div className={styles.usageCard}>
        <h3 className={styles.usageTitle}>Usage Example:</h3>
        <pre className={styles.usagePre}>
          {`import { showModal, showConfirmation, showInfo } from '@/lib/modal';

// Anywhere in your component:
showModal('example-modal', { title: 'Hello!' });

await showConfirmation({
  title: 'Delete?',
  message: 'This cannot be undone',
  onConfirm: () => deleteItem()
});

showInfo({
  title: 'Success',
  content: 'Operation completed!'
});`}
        </pre>
      </div>
    </div>
  );
}
