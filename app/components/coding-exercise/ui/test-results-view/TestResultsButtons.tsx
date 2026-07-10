"use client";

import { assembleClassNames } from "@/lib/assemble-classnames";
import StarIcon from "@/icons/star.svg";
import { processMessageContent } from "../messageUtils";
import styles from "../../CodingExercise.module.css";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import { bonusScenarioSlugs } from "../../lib/bonusScenarios";
import type { TestResult } from "../../lib/test-results-types";
import RunButton from "../RunButton";

export function TestResultsButtons() {
  const orchestrator = useOrchestrator();
  const { testSuiteResult, currentTestIdx } = useOrchestratorStore(orchestrator);
  const exercise = orchestrator.getExercise();
  const scenarios = exercise.scenarios;
  const bonusSlugs = bonusScenarioSlugs(exercise);

  const handleSelection = (idx: number, test?: TestResult) => {
    if (test) {
      orchestrator.setCurrentTest(test);

      // Set information widget data for single frame tests
      if (test.frames.length === 1) {
        const frame = test.frames[0];
        const description = frame.generateDescription() || "";
        orchestrator.setInformationWidgetData({
          html: processMessageContent(description),
          line: frame.line,
          status: frame.status
        });
      }
    } else {
      orchestrator.setCurrentTestIdx(idx);
    }
  };

  const statusLineStatus = testSuiteResult?.tests[currentTestIdx]?.status ?? "idle";

  // Until the core (non-bonus) scenarios all pass, don't reveal a bonus as
  // failing - show it in the neutral not-yet-run style instead. Passing bonuses
  // still show as passed.
  const coreComplete = Boolean(testSuiteResult?.passed);

  return (
    <div className={styles.DotsSection}>
      <div className="flex items-center justify-between w-[100%]">
        <div className={styles.Dots} data-testid="test-selector-buttons">
          {scenarios.map((scenario, idx) => {
            const test = testSuiteResult?.tests[idx];
            const status = test?.status ?? "idle";
            const isBonus = bonusSlugs.has(scenario.slug);
            const displayStatus = isBonus && !coreComplete && status === "fail" ? "idle" : status;

            return (
              <button
                key={scenario.slug + idx}
                onClick={() => handleSelection(idx, test)}
                className={assembleClassNames(
                  styles.Dot,
                  styles[displayStatus],
                  isBonus ? styles.bonus : "",
                  currentTestIdx === idx ? styles.active : ""
                )}
              >
                {isBonus && <StarIcon className={styles.DotStar} />}
              </button>
            );
          })}
        </div>
        <RunButton />
      </div>
      <div className={assembleClassNames(styles.StatusLine, styles[statusLineStatus])} />
    </div>
  );
}
