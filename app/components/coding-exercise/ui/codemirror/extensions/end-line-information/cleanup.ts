import tooltipStyles from "./informationTooltip.module.css";

/**
 * Cleanup utility for information tooltips
 * Separated from the widget class to avoid circular dependencies and simplify testing
 */
export function cleanupAllInformationTooltips(): void {
  const tooltips = document.querySelectorAll(`.${tooltipStyles.informationTooltip}`);
  tooltips.forEach((tooltip) => {
    tooltip.remove();
  });
}
