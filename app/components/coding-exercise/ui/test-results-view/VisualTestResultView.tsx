import styles from "../../CodingExercise.module.css";
interface VisualTestResultViewProps {
  isPassing: boolean;
  errorHtml: string;
}

export function VisualTestResultView({ isPassing, errorHtml }: VisualTestResultViewProps) {
  return (
    <div className={styles.testFeedback}>
      <span className={styles.badge}>{isPassing ? "Pass" : "Fail"}</span>
      {!isPassing && errorHtml && <div className={styles.message} dangerouslySetInnerHTML={{ __html: errorHtml }} />}
    </div>
  );
}
