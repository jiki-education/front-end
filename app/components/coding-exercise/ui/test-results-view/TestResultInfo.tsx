import type { TestExpect } from "../../lib/test-results-types";
import { VisualTestResultView } from "./VisualTestResultView";
import { IOTestResultView } from "./IOTestResultView";

export function TestResultInfo({ firstExpect }: { firstExpect: TestExpect | null }) {
  if (!firstExpect) {
    return null;
  }

  // Route to appropriate view based on test expect type
  if (firstExpect.type === "io") {
    return <IOTestResultView expect={firstExpect} />;
  }

  // Visual test
  let errorHtml = firstExpect.errorHtml || "";
  errorHtml = errorHtml.replace(/{value}/, String(firstExpect.actual));

  return <VisualTestResultView isPassing={firstExpect.pass} errorHtml={errorHtml} />;
}
