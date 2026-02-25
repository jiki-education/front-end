"use client";

import { useEffect, useState } from "react";
import styles from "@/app/styles/components/modals.module.css";
import type { CompletionResponseData } from "@/components/coding-exercise/lib/types";
import { getConcept } from "@/lib/concepts/actions";
import type { ConceptMeta } from "@/types/concepts";

interface ConceptUnlockedStepProps {
  completionResponse: CompletionResponseData[];
  onContinue: () => void;
}

export function ConceptUnlockedStep({ completionResponse, onContinue }: ConceptUnlockedStepProps) {
  const [concept, setConcept] = useState<ConceptMeta | null>(null);

  // Support both new format (concept_slug) and old format (concept object)
  const event = completionResponse.find((item) => item.type === "concept_unlocked");
  const conceptSlug = event?.data.concept_slug ?? event?.data.concept?.slug;

  useEffect(() => {
    if (!conceptSlug) {
      return;
    }
    getConcept(conceptSlug).then(setConcept).catch(console.error);
  }, [conceptSlug]);

  if (!concept) {
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
        You&apos;ve unlocked a new concept: <strong>{concept.title}</strong>
      </p>
      <div className={styles.conceptUnlockedCard}>
        <h3 className={styles.conceptTitle}>{concept.title}</h3>
        <p className={styles.conceptDescription}>{concept.description}</p>
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
