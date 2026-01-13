"use client";

import styles from "../../CodingExercise.module.css";
import { InspectedTestResultView } from "./InspectedTestResultView";
import { TestResultsButtons } from "./TestResultsButtons";

export default function TestResultsView() {
  return (
    <div className={styles.testResultsArea}>
      <TestResultsButtons />
      <InspectedTestResultView />
    </div>
  );
}
