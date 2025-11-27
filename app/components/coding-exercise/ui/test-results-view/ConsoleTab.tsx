"use client";

import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";

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

  // Helper function to find line number for a log entry based on timestamp
  const getLineNumberForLog = (logTime: number): number | undefined => {
    // Find the frame that corresponds to this log time (or the closest frame before it)
    let closestFrame = null;
    for (const frame of currentTest.frames) {
      if (frame.time <= logTime) {
        closestFrame = frame;
      } else {
        break;
      }
    }

    return closestFrame?.line;
  };

  return (
    <div className="console-tab bg-purple-50 text-purple-900 font-mono text-xs p-2 overflow-y-auto h-full" role="log">
      {currentTest.logLines.map((log, index) => {
        const logLineNumber = getLineNumberForLog(log.time);
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
  const totalSeconds = time / 1000000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:`;
}
