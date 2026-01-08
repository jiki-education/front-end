import type { FunctionInfo } from "./mockInstructionsData";
import styles from "./instructions-panel.module.css";

interface FunctionsGridProps {
  functions: FunctionInfo[];
  className?: string;
}

export default function FunctionsGrid({ functions, className = "" }: FunctionsGridProps) {
  return (
    <div className={`${styles.functionsContainer} ${className}`}>
      <h2>Functions</h2>
      <p className={styles.functionSectionInfo}>Available functions you can use in your code.</p>
      <div className={styles.functionsList}>
        {functions.map((func, index) => (
          <div key={index} className={styles.functionCard}>
            <div className={styles.functionHeader}>
              <div className={styles.functionSignature}>{func.signature}</div>
            </div>
            <p className={styles.functionDescription}>{func.description}</p>
            {func.examples && func.examples.length > 0 && (
              <div className={styles.functionExamples}>
                <p className={styles.functionExamplesLabel}>Examples:</p>
                <div className={styles.functionExamplesList}>
                  {func.examples.map((example, idx) => (
                    <div key={idx} className={styles.functionExample}>
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
