"use client";

import { createContext, useContext } from "react";
import type Orchestrator from "./Orchestrator";

const OrchestratorContext = createContext<Orchestrator | null>(null);

export function useOrchestrator(): Orchestrator {
  const orchestrator = useContext(OrchestratorContext);
  if (!orchestrator) {
    throw new Error("useOrchestrator must be used within an OrchestratorProvider");
  }
  return orchestrator;
}

export default OrchestratorContext;
