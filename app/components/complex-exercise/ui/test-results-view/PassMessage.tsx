import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";

interface PassMessageProps {
  testIdx: number;
}

export function PassMessage({ testIdx }: PassMessageProps) {
  const orchestrator = useOrchestrator();
  const { exerciseTitle } = useOrchestratorStore(orchestrator);

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">Test Passed!</h3>
          <p className="text-sm text-green-700 mt-1">{congratsMessages[stringToHash(exerciseTitle, testIdx)]}</p>
        </div>
      </div>
    </div>
  );
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

// ty djipity
const congratsMessages = [
  "Well done!",
  "Nice work!",
  "Fantastic job!",
  "Amazing effort!",
  "Great achievement!",
  "Congratulations!",
  "Congrats!"
];
