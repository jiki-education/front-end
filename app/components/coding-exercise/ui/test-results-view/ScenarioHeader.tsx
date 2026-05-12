import { marked } from "marked";
import styles from "../../CodingExercise.module.css";

export function ScenarioHeader({ name, description }: { name: string; description?: string }) {
  return (
    <>
      <span className={styles.instructionLabel}>{name}</span>
      {description && (
        <div className="my-8">
          <div
            className="ui-textual-content ui-textual-content-compact"
            dangerouslySetInnerHTML={{ __html: marked.parse(description, { async: false }) }}
          />
        </div>
      )}
    </>
  );
}
