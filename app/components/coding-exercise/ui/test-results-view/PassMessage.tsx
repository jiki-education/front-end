import { useTranslations } from "next-intl";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";

interface PassMessageProps {
  testIdx: number;
}

const CONGRATS_KEYS = [
  "congratsWellDone",
  "congratsNiceWork",
  "congratsFantasticJob",
  "congratsAmazingEffort",
  "congratsGreatAchievement",
  "congratsCongratulations",
  "congratsCongrats"
] as const;

export function PassMessage({ testIdx }: PassMessageProps) {
  const t = useTranslations("codingExercise.testResults");
  const orchestrator = useOrchestrator();
  const { exerciseTitle } = useOrchestratorStore(orchestrator);

  return <p className="font-semibold">{t(CONGRATS_KEYS[stringToHash(exerciseTitle, testIdx)])}</p>;
}

function stringToHash(input: string, testIdx: number): number {
  const PRIME = 31;
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    hash = (hash * PRIME + input.charCodeAt(i)) % CONGRATS_KEYS.length;
  }

  hash = (hash + testIdx * PRIME) % CONGRATS_KEYS.length;

  return hash;
}
