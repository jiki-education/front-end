"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import styles from "@/app/styles/components/modals.module.css";
import type { CompletionResponseData } from "@/components/coding-exercise/lib/types";
import { getConcept } from "@/lib/api/concepts";
import { reportError } from "@/lib/reportError";
import type { ConceptMeta } from "@/types/concepts";

interface ConceptUnlockedStepProps {
  completionResponse: CompletionResponseData[];
  onContinue: () => void;
}

export function ConceptUnlockedStep({ completionResponse, onContinue }: ConceptUnlockedStepProps) {
  const t = useTranslations("modals.exerciseCompletion.conceptUnlocked");
  const [concept, setConcept] = useState<ConceptMeta | null>(null);

  // Support both new format (concept_slug) and old format (concept object)
  const event = completionResponse.find((item) => item.type === "concept_unlocked");
  const conceptSlug = event?.data.concept_slug ?? event?.data.concept?.slug;

  useEffect(() => {
    if (!conceptSlug) {
      return;
    }
    getConcept(conceptSlug).then(setConcept).catch(reportError);
  }, [conceptSlug]);

  if (!concept) {
    return (
      <>
        <h2 className={styles.modalTitle}>{t("title")}</h2>
        <p className={styles.modalMessage}>{t("messageGeneric")}</p>
        <div className={styles.modalButtonsDivider}></div>
        <div className={styles.modalButtons}>
          <button onClick={onContinue} className="ui-btn ui-btn-primary ui-btn-large flex-1">
            {t("continue")}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className={styles.modalTitle}>{t("title")}</h2>
      <p className={styles.modalMessage}>
        {t.rich("messageNamed", { title: concept.title, strong: (chunks) => <strong>{chunks}</strong> })}
      </p>
      <div className={styles.conceptUnlockedCard}>
        <h3 className={styles.conceptTitle}>{concept.title}</h3>
        <p className={styles.conceptDescription}>{concept.description}</p>
      </div>
      <div className={styles.modalButtonsDivider}></div>
      <div className={styles.modalButtons}>
        <button onClick={onContinue} className="ui-btn ui-btn-primary ui-btn-large flex-1">
          {t("continue")}
        </button>
      </div>
    </>
  );
}
