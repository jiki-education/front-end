"use client";

import { useOrchestratorStore } from "../lib/Orchestrator";
import { useOrchestrator } from "../lib/OrchestratorContext";
import { TIME_SCALE_FACTOR } from "@jiki/interpreters";
import { PanelHeader } from "./PanelHeader";
import style from "./log-panel.module.css";

interface LogLineProps {
  log: { time: number; output: string };
  isActive: boolean;
  index: number;
  lineNumber?: number;
}

export default function LogPanel() {
  const orchestrator = useOrchestrator();
  const { currentTest, currentTestTime } = useOrchestratorStore(orchestrator);

  if (!currentTest || currentTest.logLines.length === 0) {
    const description = (
      <>
        This is the output from your code execution. Here you can analyse the changes you&apos;ve made. Use{" "}
        <code>console.log()</code> to log values.
      </>
    );
    return (
      <div role="log">
        <PanelHeader title="Scenario Log" description={description} />
      </div>
    );
  }

  // Pre-compute line numbers for all log lines to avoid O(n*m) complexity
  const logLineNumbers = currentTest.logLines.map((log) => {
    return currentTest.frames.find((frame) => frame.time === log.time)?.line;
  });

  const description = (
    <>
      This is the output from your code execution. Here you can analyse the changes you&apos;ve made. Use{" "}
      <code>console.log()</code> to log values.
    </>
  );

  return (
    <div role="log">
      <PanelHeader title="Scenario Log" description={description} />
      <div className="py-24 px-32">
        <div className={style.consoleOutput}>
          {currentTest.logLines.map((log, index) => {
            const logLineNumber = logLineNumbers[index];
            return (
              <LogLine
                key={index}
                log={log}
                isActive={currentTestTime === log.time}
                index={index}
                lineNumber={logLineNumber}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LogLine({ log, isActive, index, lineNumber }: LogLineProps) {
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
      <div className={style.consoleLogTimestamp}>{formatTimestamp(log.time)}</div>
      {lineNumber !== undefined && (
        <div className={style.consoleLogLineWrapper}>
          <div className={style.consoleLogLine}>L{lineNumber}</div>
        </div>
      )}
      <div className={style.consoleLogContent}>{log.output}</div>
    </div>
  );
}

function formatTimestamp(time: number): string {
  const timeInMs = time / TIME_SCALE_FACTOR;
  const seconds = Math.floor(timeInMs / 1000);
  const milliseconds = timeInMs % 1000;
  return `${seconds.toString().padStart(2, "0")}:${milliseconds.toString().padStart(3, "0")}`;
}
