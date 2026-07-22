import type { ConceptCardData } from "@/components/concepts/ConceptCard";
import { forwardRef } from "react";
import { useTranslations } from "next-intl";
import LibraryChallengesState from "./LibraryChallengesState";
import LibraryEmptyState from "./LibraryEmptyState";
import LibraryWithConcepts from "./LibraryWithConcepts";
import styles from "./instructions-panel.module.css";

type LibraryState = "loading" | "with-concepts" | "empty" | "challenges";

interface LibrarySectionProps {
  concepts: ConceptCardData[];
  isLoading: boolean;
  isChallenge: boolean;
}

const LibrarySection = forwardRef<HTMLDivElement, LibrarySectionProps>(function LibrarySection(
  { concepts, isLoading, isChallenge },
  ref
) {
  const state = getLibraryState({ concepts, isLoading, isChallenge });

  return (
    <div ref={ref}>
      {state === "loading" && <LibraryLoading />}
      {state === "with-concepts" && <LibraryWithConcepts concepts={concepts} />}
      {state === "empty" && <LibraryEmptyState />}
      {state === "challenges" && <LibraryChallengesState />}
    </div>
  );
});

export default LibrarySection;

function LibraryLoading() {
  const t = useTranslations("codingExercise.instructionsPanel");
  return (
    <LibraryWrapper>
      <p className={styles.libraryDescription}>{t("loadingConcepts")}</p>
    </LibraryWrapper>
  );
}

function LibraryWrapper({ children }: { children: React.ReactNode }) {
  const t = useTranslations("codingExercise.instructionsPanel");
  return (
    <div className={styles.conceptsContainer}>
      <h2 className={styles.conceptsTitle}>{t("conceptLibraryTitle")}</h2>
      {children}
    </div>
  );
}

function getLibraryState({
  concepts,
  isLoading,
  isChallenge
}: {
  concepts: ConceptCardData[];
  isLoading: boolean;
  isChallenge: boolean;
}): LibraryState {
  if (isLoading) {
    return "loading";
  }
  if (concepts.length > 0) {
    return "with-concepts";
  }
  if (isChallenge) {
    return "challenges";
  }
  return "empty";
}

export { LibraryWrapper };
