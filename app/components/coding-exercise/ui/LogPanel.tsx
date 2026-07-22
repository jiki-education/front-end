"use client";

import { useTranslations } from "next-intl";
import { useOrchestratorStore } from "../lib/Orchestrator";
import { useOrchestrator } from "../lib/OrchestratorContext";
import { PanelHeader } from "./PanelHeader";
import style from "./log-panel.module.css";
import EmptyClipboardIcon from "@/icons/empty-clipboard.svg";

interface LogLineProps {
  log: { time: number; output: string };
  isActive: boolean;
  index: number;
  lineNumber?: number;
  frameNumber?: number;
}

export default function LogPanel() {
  const t = useTranslations("codingExercise.logPanel");
  const orchestrator = useOrchestrator();
  const { currentTest, currentTestTime } = useOrchestratorStore(orchestrator);

  if (!currentTest || currentTest.logLines.length === 0) {
    const description = t.rich("emptyDescription", { code: (chunks) => <code>{chunks}</code> });
    return (
      <div role="log">
        <PanelHeader title={t("title")} description={description} />
        <div className={style.emptyState}>
          <EmptyClipboardIcon className={style.emptyStateIcon} />
          <div className={style.emptyStateText}>{t("emptyState")}</div>
        </div>
      </div>
    );
  }

  // Pre-compute line numbers and frame indices for all log lines to avoid O(n*m) complexity
  const logFrameInfo = currentTest.logLines.map((log) => {
    const frameIndex = currentTest.frames.findIndex((frame) => frame.time === log.time);
    const frame = frameIndex >= 0 ? currentTest.frames[frameIndex] : undefined;
    return { line: frame?.line, frameNumber: frameIndex >= 0 ? frameIndex + 1 : undefined };
  });

  const scenarioStatusClass = currentTest.status === "pass" ? style.scenarioPass : style.scenarioFail;
  const description = t.rich("description", {
    name: currentTest.name,
    scenario: (chunks) => <span className={`${style.scenarioName} ${scenarioStatusClass}`}>{chunks}</span>,
    code: (chunks) => <code>{chunks}</code>
  });

  return (
    <div role="log">
      <PanelHeader title={t("title")} description={description} />
      <div className="py-24 px-32">
        <div className={style.consoleOutput}>
          {currentTest.logLines.map((log, index) => {
            const info = logFrameInfo[index];
            return (
              <LogLine
                key={index}
                log={log}
                isActive={currentTestTime === log.time}
                index={index}
                lineNumber={info.line}
                frameNumber={info.frameNumber}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LogLine({ log, isActive, index, lineNumber, frameNumber }: LogLineProps) {
  const orchestrator = useOrchestrator();

  const handleClick = () => {
    orchestrator.setCurrentTestTime(log.time);
  };

  return (
    <div
      className={`${style.consoleLogEntry} ${isActive ? style.highlighted : ""}`}
      onClick={handleClick}
      data-testid={`log-line-${index}`}
    >
      <div className={style.consoleLogTimestamp}>{frameNumber !== undefined ? `F${frameNumber}` : ""}</div>
      {lineNumber !== undefined && (
        <div className={style.consoleLogLineWrapper}>
          <div className={style.consoleLogLine}>L{lineNumber}</div>
        </div>
      )}
      <div className={style.consoleLogContent}>{log.output}</div>
    </div>
  );
}
