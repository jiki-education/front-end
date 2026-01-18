"use client";

import styles from "@/app/styles/components/modals.module.css";
import type { CompletionResponseData } from "@/components/coding-exercise/lib/types";

interface ConceptUnlockedStepProps {
  completionResponse: CompletionResponseData[];
  onContinue: () => void;
}

export function ConceptUnlockedStep({ completionResponse, onContinue }: ConceptUnlockedStepProps) {
  const unlockedConcept = completionResponse.find((item) => item.type === "concept_unlocked")?.data.concept;

  if (!unlockedConcept) {
    return (
      <>
        <h2 className={styles.modalTitle}>Concept unlocked!</h2>
        <p className={styles.modalMessage}>You&apos;ve unlocked a new concept to explore.</p>
        <div className={styles.modalButtonsDivider}></div>
        <div className={styles.modalButtons}>
          <button onClick={onContinue} className={styles.btnPrimary}>
            Continue
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className={styles.modalTitle}>Concept unlocked!</h2>
      <p className={styles.modalMessage}>
        You&apos;ve unlocked a new concept: <strong>{unlockedConcept.title}</strong>
      </p>
      <div className={styles.conceptUnlockedCard}>
        <h3 className={styles.conceptTitle}>{unlockedConcept.title}</h3>
        <p className={styles.conceptDescription}>{unlockedConcept.description}</p>
      </div>
      <div className={styles.modalButtonsDivider}></div>
      <div className={styles.modalButtons}>
        <button onClick={onContinue} className={styles.btnPrimary}>
          Continue
        </button>
      </div>
    </>
  );
}
