import type { ReactNode } from "react";
import { marked } from "marked";
import styles from "../../CodingExercise.module.css";

export function ScenarioHeader({
  name,
  description,
  statusIcon
}: {
  name: string;
  description?: string;
  statusIcon?: ReactNode;
}) {
  return (
    <>
      <span className={styles.instructionLabel}>
        <span>{name}</span>
        {statusIcon}
      </span>
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
