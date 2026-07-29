import React from "react";
import { useOrchestratorStore } from "@/components/coding-exercise/lib/Orchestrator";
import type Orchestrator from "@/components/coding-exercise/lib/Orchestrator";
import styles from "../harness.module.css";

interface FrameInfoProps {
  orchestrator: Orchestrator;
}

export function FrameInfo({ orchestrator }: FrameInfoProps) {
  const { currentTestTime, currentFrame, foldedLines } = useOrchestratorStore(orchestrator);

  return (
    <div className={`${styles.panel} ${styles.mt}`}>
      <h2 className={styles.panelTitle}>Current Frame Info:</h2>
      <p data-testid="current-frame">Frame: {currentFrame ? currentFrame.generateDescription() : "None"}</p>
      <p data-testid="frame-line">Line: {currentFrame?.line || 0}</p>
      <p data-testid="frame-time">Timeline Time: {currentTestTime || 0}</p>
      <p data-testid="folded-lines">Folded Lines: {foldedLines.join(", ") || "None"}</p>
    </div>
  );
}
