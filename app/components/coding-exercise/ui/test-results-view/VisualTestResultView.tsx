import { marked } from "marked";
import { useTranslations } from "next-intl";
import styles from "../../CodingExercise.module.css";
import { PassMessage } from "./PassMessage";

interface VisualTestResultViewProps {
  isPassing: boolean;
  errorHtml: string;
  testIdx?: number;
}

export function VisualTestResultView({ isPassing, errorHtml, testIdx = 0 }: VisualTestResultViewProps) {
  const t = useTranslations("codingExercise.testResults");
  return (
    <div className={styles.testFeedback}>
      <span className={styles.badge}>{isPassing ? t("passBadge") : t("failBadge")}</span>
      {isPassing && <PassMessage testIdx={testIdx} />}
      {!isPassing && errorHtml && (
        <div
          className={styles.message}
          dangerouslySetInnerHTML={{ __html: marked.parseInline(errorHtml, { async: false }) }}
        />
      )}
    </div>
  );
}
