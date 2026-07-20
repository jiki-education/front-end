import { useTranslations } from "next-intl";
import Tooltip from "@/components/ui/Tooltip";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import styles from "../../CodingExercise.module.css";

export default function InformationWidgetToggleButton({ disabled }: { disabled: boolean }) {
  const t = useTranslations("codingExercise.scrubber");
  const orchestrator = useOrchestrator();
  const { shouldShowInformationWidget } = useOrchestratorStore(orchestrator);

  const handleToggle = () => {
    if (shouldShowInformationWidget) {
      orchestrator.hideInformationWidget();
    } else {
      orchestrator.showInformationWidget();
    }
  };

  const tooltipContent = shouldShowInformationWidget ? t("toggleInfoOff") : t("toggleInfoOn");

  return (
    <Tooltip content={tooltipContent} disabled={disabled}>
      <button
        data-testid="information-widget-toggle"
        onClick={handleToggle}
        disabled={disabled}
        className={`${styles.toggleBtn} ${shouldShowInformationWidget ? styles.on : ""}`}
        aria-label={shouldShowInformationWidget ? t("hideInfoWidget") : t("showInfoWidget")}
        aria-pressed={shouldShowInformationWidget}
      />
    </Tooltip>
  );
}
