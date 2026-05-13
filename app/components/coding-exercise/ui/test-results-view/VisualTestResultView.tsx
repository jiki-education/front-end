import styles from "../../CodingExercise.module.css";
import { PassMessage } from "./PassMessage";

interface VisualTestResultViewProps {
  isPassing: boolean;
  errorHtml: string;
  testIdx?: number;
}

export function VisualTestResultView({ isPassing, errorHtml, testIdx = 0 }: VisualTestResultViewProps) {
  return (
    <div className={styles.testFeedback}>
      <span className={styles.badge}>{isPassing ? "Pass" : "Fail"}</span>
      {isPassing && <PassMessage testIdx={testIdx} />}
      {!isPassing && errorHtml && <div className={styles.message} dangerouslySetInnerHTML={{ __html: errorHtml }} />}
    </div>
  );
}
