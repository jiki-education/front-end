import { useTranslations } from "next-intl";
import { ConceptsLayout } from "@/components/concepts";
import styles from "./ConceptErrorView.module.css";

interface ConceptErrorViewProps {
  message: string | null;
  onBack: () => void;
}

export function ConceptErrorView({ message, onBack }: ConceptErrorViewProps) {
  const t = useTranslations("concepts.error");
  return (
    <ConceptsLayout>
      <div className={styles.center}>
        <div className={styles.message}>{message ?? t("notFound")}</div>
        <button onClick={onBack} className={styles.backButton}>
          {t("back")}
        </button>
      </div>
    </ConceptsLayout>
  );
}
