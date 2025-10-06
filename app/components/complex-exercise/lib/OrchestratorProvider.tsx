"use client";

import { type ReactNode } from "react";
import OrchestratorContext, { useOrchestrator } from "./OrchestratorContext";
import type Orchestrator from "./Orchestrator";

interface OrchestratorProviderProps {
  orchestrator: Orchestrator;
  children: ReactNode;
}

export default function OrchestratorProvider({ orchestrator, children }: OrchestratorProviderProps) {
  return <OrchestratorContext.Provider value={orchestrator}>{children}</OrchestratorContext.Provider>;
}

// Re-export the hook with a more descriptive name for external usage
export const useOrchestratorContext = useOrchestrator;
