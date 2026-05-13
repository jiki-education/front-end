import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";

interface PassMessageProps {
  testIdx: number;
}

export function PassMessage({ testIdx }: PassMessageProps) {
  const orchestrator = useOrchestrator();
  const { exerciseTitle } = useOrchestratorStore(orchestrator);

  return <p className="font-semibold">{congratsMessages[stringToHash(exerciseTitle, testIdx)]}</p>;
}

function stringToHash(input: string, testIdx: number): number {
  const PRIME = 31;
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    hash = (hash * PRIME + input.charCodeAt(i)) % congratsMessages.length;
  }

  hash = (hash + testIdx * PRIME) % congratsMessages.length;

  return hash;
}

const congratsMessages = [
  "Well done!",
  "Nice work!",
  "Fantastic job!",
  "Amazing effort!",
  "Great achievement!",
  "Congratulations!",
  "Congrats!"
];
