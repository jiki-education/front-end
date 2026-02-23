import { forwardRef } from "react";
import { marked } from "marked";
import styles from "./instructions-panel.module.css";

interface InstructionsContentProps {
  instructions: string;
}

const InstructionsContent = forwardRef<HTMLDivElement, InstructionsContentProps>(function InstructionsContent(
  { instructions },
  ref
) {
  return (
    <div ref={ref} className={styles.instructionsContainer}>
      <h2>Instructions</h2>
      <div
        className={styles.instructionsContent}
        dangerouslySetInnerHTML={{
          __html: marked(instructions)
        }}
      />
    </div>
  );
});

export default InstructionsContent;
