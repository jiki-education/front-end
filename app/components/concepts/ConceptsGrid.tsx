import { useTranslations } from "next-intl";
import styles from "@/app/styles/modules/concepts.module.css";
import type { ConceptForDisplay } from "@/types/concepts";
import ConceptCard from "./ConceptCard";
import EmptyState from "@/components/ui/EmptyState";
import FolderIcon from "@/icons/folder.svg";

interface ConceptsGridProps {
  concepts: ConceptForDisplay[];
  showEmptyState?: boolean;
}

export default function ConceptsGrid({ concepts, showEmptyState = false }: ConceptsGridProps) {
  const t = useTranslations("concepts.list");
  if (showEmptyState) {
    return <EmptyState icon={FolderIcon} title={t("emptyTitle")} body={t("emptyBody")} />;
  }

  return (
    <div className={styles.conceptsGrid}>
      {concepts.map((concept) => (
        <ConceptCard
          key={concept.slug}
          concept={{
            slug: concept.slug,
            title: concept.title,
            description: concept.description,
            subConceptCount: concept.childrenCount,
            userMayAccess: concept.isUnlocked
          }}
        />
      ))}
    </div>
  );
}
