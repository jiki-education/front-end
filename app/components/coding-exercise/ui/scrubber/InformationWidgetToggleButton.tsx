import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import styles from "../../CodingExercise.module.css";

export default function InformationWidgetToggleButton({ disabled }: { disabled: boolean }) {
  const orchestrator = useOrchestrator();
  const { shouldShowInformationWidget } = useOrchestratorStore(orchestrator);

  const handleToggle = () => {
    if (shouldShowInformationWidget) {
      orchestrator.hideInformationWidget();
    } else {
      orchestrator.showInformationWidget();
    }
  };

  return (
    <button
      data-testid="information-widget-toggle"
      onClick={handleToggle}
      disabled={disabled}
      className={`${styles.toggleBtn} ${shouldShowInformationWidget ? styles.on : ""}`}
      aria-label={shouldShowInformationWidget ? "Hide information widget" : "Show information widget"}
      aria-pressed={shouldShowInformationWidget}
    />
  );
}
