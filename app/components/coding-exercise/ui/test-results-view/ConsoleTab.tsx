"use client";

import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";

interface LogLineProps {
  log: { time: number; output: string };
  isActive: boolean;
}

export default function ConsoleTab() {
  const orchestrator = useOrchestrator();
  const { currentTest, currentTestTime } = useOrchestratorStore(orchestrator);

  if (!currentTest || currentTest.logLines.length === 0) {
    return <div className="console-tab-empty text-gray-500 text-center p-5 italic">No console output</div>;
  }

  return (
    <div className="console-tab bg-gray-900 text-gray-300 font-mono text-xs p-2 overflow-y-auto h-full">
      {currentTest.logLines.map((log, index) => (
        <LogLine key={index} log={log} isActive={currentTestTime >= log.time} />
      ))}
    </div>
  );
}

function LogLine({ log, isActive }: LogLineProps) {
  const orchestrator = useOrchestrator();

  const handleClick = () => {
    orchestrator.setCurrentTestTime(log.time);
  };

  return (
    <div
      className={`log-line py-0.5 cursor-pointer hover:bg-gray-700 ${
        isActive ? "opacity-100 bg-gray-800" : "opacity-40"
      }`}
      onClick={handleClick}
    >
      <span className="log-timestamp text-gray-500 mr-2">{formatTimestamp(log.time)}</span>
      <span>{log.output}</span>
    </div>
  );
}

function formatTimestamp(time: number): string {
  const seconds = (time / 1000000).toFixed(3);
  return `${seconds}s`;
}
