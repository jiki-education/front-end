import type { ConceptCardData } from "@/components/concepts/ConceptCard";
import ConceptCard from "@/components/concepts/ConceptCard";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { LibraryWrapper } from "./LibrarySection";
import styles from "./instructions-panel.module.css";

interface LibraryWithConceptsProps {
  concepts: ConceptCardData[];
}

export default function LibraryWithConcepts({ concepts }: LibraryWithConceptsProps) {
  const t = useTranslations("codingExercise.instructionsPanel");
  return (
    <LibraryWrapper>
      <p className={styles.libraryDescriptionWithButton}>{t("libraryWithConcepts")}</p>
      <div className={styles.conceptsList}>
        {concepts.map((concept, index) => (
          <ConceptCard smallVersion key={index} concept={concept} />
        ))}
      </div>
      <OpenConceptLibraryButton />
    </LibraryWrapper>
  );
}

function OpenConceptLibraryButton() {
  const t = useTranslations("codingExercise.instructionsPanel");
  const routes = useLocaleRoutes();
  return (
    <Link href={routes.concepts()} className="ui-btn ui-btn-small ui-btn-tertiary w-full">
      {t("openConceptLibrary")}
    </Link>
  );
}

export { OpenConceptLibraryButton };
