import { marked } from "marked";
import styles from "./instructions-panel.module.css";

interface InstructionsContentProps {
  instructions: string;
  className?: string;
}

export default function InstructionsContent({ instructions, className = "" }: InstructionsContentProps) {
  return (
    <div className={`${styles.instructionsContainer} ${className}`}>
      <h2>Instructions</h2>
      <div
        className={styles.instructionsContent}
        dangerouslySetInnerHTML={{
          __html: marked(instructions)
        }}
      />
    </div>
  );
}
