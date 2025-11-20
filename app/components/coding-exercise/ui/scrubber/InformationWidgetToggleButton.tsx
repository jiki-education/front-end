import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import styles from "./InformationWidgetToggleButton.module.css";

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
      className={`${styles.informationWidgetToggleBtn} ${shouldShowInformationWidget ? styles.active : ""}`}
      aria-label={shouldShowInformationWidget ? "Hide information widget" : "Show information widget"}
      aria-pressed={shouldShowInformationWidget}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.infoIcon}
      >
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 7V11M8 5V5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}
