import React from "react";
import { useOrchestratorStore } from "../lib/Orchestrator";
import { useOrchestrator } from "../lib/OrchestratorContext";
import { TIME_SCALE_FACTOR } from "@jiki/interpreters";

export default function FrameDescription() {
  const orchestrator = useOrchestrator();
  const { currentTest, currentTestTime, currentFrame } = useOrchestratorStore(orchestrator);

  // Subscribe to time for display
  const time = currentTestTime || 0;

  if (!currentTest || !currentFrame) {
    return (
      <div className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-500 rounded min-h-[2.5rem]">
        <span className="text-sm">No frame selected</span>
      </div>
    );
  }

  return (
    <div
      key={`frame-${currentFrame.line}-${currentFrame.time}`}
      className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded min-h-[2.5rem]"
    >
      <div className="flex items-center gap-3 w-full">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Line {currentFrame.line}</span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded ${
              currentFrame.status === "SUCCESS" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {currentFrame.status}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs ml-auto">
          <span className="text-gray-400">Timeline:</span>
          <span className="font-mono text-gray-600">{(time / TIME_SCALE_FACTOR / 1000).toFixed(3)}s</span>
        </div>
      </div>
    </div>
  );
}
