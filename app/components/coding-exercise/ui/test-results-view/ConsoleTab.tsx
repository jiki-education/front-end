"use client";

import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import { TIME_SCALE_FACTOR } from "@jiki/interpreters";

interface LogLineProps {
  log: { time: number; output: string };
  isActive: boolean;
  index: number;
  lineNumber?: number;
}

export default function ConsoleTab() {
  const orchestrator = useOrchestrator();
  const { currentTest, currentFrame } = useOrchestratorStore(orchestrator);

  if (!currentTest || currentTest.logLines.length === 0) {
    return <div className="console-tab-empty text-gray-500 text-center p-5 italic">No console output</div>;
  }

  // Pre-compute line numbers for all log lines to avoid O(n*m) complexity
  const logLineNumbers = currentTest.logLines.map((log) => {
    // Find the frame that corresponds to this log time (or the closest frame before it)
    let closestFrame = null;
    for (const frame of currentTest.frames) {
      if (frame.time <= log.time) {
        closestFrame = frame;
      } else {
        break;
      }
    }
    return closestFrame?.line;
  });

  return (
    <div className="console-tab bg-purple-50 text-purple-900 font-mono text-xs p-2 overflow-y-auto h-full" role="log">
      {currentTest.logLines.map((log, index) => {
        const logLineNumber = logLineNumbers[index];
        return (
          <LogLine
            key={index}
            log={log}
            isActive={currentFrame?.line === logLineNumber}
            index={index}
            lineNumber={logLineNumber}
          />
        );
      })}
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
      className={`log-line py-0.5 cursor-pointer hover:bg-purple-200 ${isActive ? "bg-purple-300" : ""}`}
      onClick={handleClick}
      data-testid={`log-line-${index}`}
    >
      <span className="log-timestamp text-purple-600 mr-2">{formatTimestamp(log.time)}</span>
      {lineNumber !== undefined && <span className="log-line-number text-purple-500 mr-2">L{lineNumber}</span>}
      <span>{log.output}</span>
    </div>
  );
}

function formatTimestamp(time: number): string {
  const timeInMs = time / TIME_SCALE_FACTOR;
  const seconds = Math.floor(timeInMs / 1000);
  const milliseconds = timeInMs % 1000;
  return `${seconds.toString().padStart(2, "0")}:${milliseconds.toString().padStart(3, "0")}`;
}
