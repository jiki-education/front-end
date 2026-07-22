import { assembleClassNames } from "@/lib/assemble-classnames";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import styles from "../../../CodingExercise.module.css";
import { useOrchestratorStore } from "../../../lib/Orchestrator";
import { useOrchestrator } from "../../../lib/OrchestratorContext";
import type { TestExpect } from "../../../lib/test-results-types";
import Scrubber from "../../scrubber/Scrubber";
import { VisualTestCanvas } from "../VisualTestCanvas";
import { VisualTestResultView } from "../VisualTestResultView";
import { VisualTestLHS } from "./VisualTestLHS";
import type { VisualExerciseDefinition } from "@jiki/curriculum";
import { useEffect, useState } from "react";

export function VisualInspectedView() {
  const orchestrator = useOrchestrator();
  const { currentTest } = useOrchestratorStore(orchestrator);

  if (currentTest && currentTest.type === "visual") {
    return <VisualInspectedResultView />;
  }

  return <VisualInspectedPreviewView />;
}

function VisualInspectedPreviewView() {
  const t = useTranslations("codingExercise.testResults");
  const orchestrator = useOrchestrator();
  const { currentTestIdx } = useOrchestratorStore(orchestrator);
  const exercise = orchestrator.getExercise() as VisualExerciseDefinition;
  const scenario = exercise.scenarios[currentTestIdx];

  const [view, setView] = useState<HTMLElement | null>(null);

  // Initialize view from exercise instance - view is created inside effect and must be stored in state
  useEffect(() => {
    const exerciseInstance = new exercise.ExerciseClass();
    scenario.setup?.(exerciseInstance);
    setView(exerciseInstance.getView());

    return () => {
      const v = exerciseInstance.getView();
      v.style.display = "none";
      // document.body can be null when this cleanup runs during page teardown
      // (typed non-null but seen null in production - JIKI-FRONT-END-3E/3K).
      (document.body as HTMLElement | null)?.appendChild(v);
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
                <span className={styles.badge}>{t("pendingBadge")}</span>
                <div className={styles.message}>{t("pendingMessage")}</div>
              </div>
            </VisualTestLHS>

            <VisualTestCanvas view={view} />
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualInspectedResultView() {
  const orchestrator = useOrchestrator();
  const { currentTest, isSpotlightActive } = useOrchestratorStore(orchestrator);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- orchestrator is stable from context, including it breaks everything.
  const firstExpect = useMemo(() => orchestrator.getFirstExpect(), [currentTest]);

  if (!currentTest || currentTest.type !== "visual") {
    return null;
  }

  return (
    <div className={assembleClassNames(styles.visualPlayer, currentTest.status === "fail" ? "fail" : "pass")}>
      <div className={styles.playerCanvas}>
        <div className={styles.playerContentRow}>
          <div className={styles.contentBelowTabs}>
            <VisualTestLHS name={currentTest.name} status={currentTest.status} footer={<Scrubber />}>
              <TestResultInfo firstExpect={firstExpect} />
            </VisualTestLHS>

            <VisualTestCanvas view={currentTest.view} isSpotlightActive={isSpotlightActive} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TestResultInfo({ firstExpect }: { firstExpect: TestExpect | null }) {
  const t = useTranslations("codingExercise.testResults");
  const orchestrator = useOrchestrator();
  const { currentTest, testSuiteResult } = useOrchestratorStore(orchestrator);

  if (!firstExpect) {
    return null;
  }

  const testIdx =
    testSuiteResult && currentTest ? testSuiteResult.tests.findIndex((test) => test.slug === currentTest.slug) : 0;

  let errorHtml = firstExpect.errorHtml || "";
  if ("actual" in firstExpect) {
    errorHtml = errorHtml.replace(/{value}/, String(firstExpect.actual));
  }

  if (currentTest?.status === "lint_warning") {
    return <VisualTestResultView isPassing={false} errorHtml={t("lintWarningPlain")} testIdx={Math.max(0, testIdx)} />;
  }

  if (currentTest?.status === "fail" && firstExpect.pass) {
    return <VisualTestResultView isPassing={false} errorHtml={t("genericError")} />;
  }

  return <VisualTestResultView isPassing={firstExpect.pass} errorHtml={errorHtml} testIdx={Math.max(0, testIdx)} />;
}
