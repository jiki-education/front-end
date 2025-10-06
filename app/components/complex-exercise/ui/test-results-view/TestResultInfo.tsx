import type { TestExpect } from "../../lib/test-results-types";
import { StateTestResultView } from "./StateTestResultView";

export function TestResultInfo({ firstExpect }: { firstExpect: TestExpect | null }) {
  if (!firstExpect) {
    return null;
  }

  let errorHtml = firstExpect.errorHtml || "";
  errorHtml = errorHtml.replace(/{value}/, firstExpect.actual);

  return <StateTestResultView isPassing={firstExpect.pass} errorHtml={errorHtml} />;
}
