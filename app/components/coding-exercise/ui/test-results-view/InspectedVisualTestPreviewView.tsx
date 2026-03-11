import { useEffect, useState } from "react";
import type { VisualExerciseDefinition } from "@jiki/curriculum";
import styles from "../../CodingExercise.module.css";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import { VisualTestCanvas } from "./VisualTestCanvas";
import { VisualTestLHS } from "./InspectedVisualTestResultView";

export function InspectedVisualTestPreviewView() {
  const orchestrator = useOrchestrator();
  const { currentTestIdx } = useOrchestratorStore(orchestrator);
  const exercise = orchestrator.getExercise() as VisualExerciseDefinition;
  const scenario = exercise.scenarios[currentTestIdx];

  const [view, setView] = useState<HTMLElement | null>(null);

  // Initialize view from exercise instance - view is created inside effect and must be stored in state
  useEffect(() => {
    // Create fresh exercise instance
    const exerciseInstance = new exercise.ExerciseClass();

    // Run setup if provided
    scenario.setup?.(exerciseInstance);

    // Get the view
    setView(exerciseInstance.getView());

    // Cleanup
    return () => {
      const v = exerciseInstance.getView();
      v.style.display = "none";
      document.body.appendChild(v);
    };
  }, [currentTestIdx, exercise.ExerciseClass, scenario]);

  if (!view) {
    return null;
  }

  return (
    <div className={styles.visualPlayer}>
      <div className={styles.playerCanvas}>
        <div className={styles.playerContentRow}>
          <div className={styles.contentBelowTabs}>
            <VisualTestLHS name={scenario.name} status="pending">
              <div className={styles.testFeedback}>
                <span className={styles.badge}>Pending</span>
                <div className={styles.message}>Run your code to see whether this scenario passes or fails.</div>
              </div>
            </VisualTestLHS>

            <VisualTestCanvas view={view} />
          </div>
        </div>
      </div>
    </div>
  );
}
