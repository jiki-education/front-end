import { useOrchestrator } from "../lib/OrchestratorContext";
import { useOrchestratorStore } from "../lib/Orchestrator";
import type { Language } from "@jiki/curriculum";

interface LanguageOption {
  value: Language;
  label: string;
}

const LANGUAGES: LanguageOption[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "jikiscript", label: "JikiScript" }
];

export default function LanguageToggle() {
  const orchestrator = useOrchestrator();
  const { language } = useOrchestratorStore(orchestrator);

  return (
    <div className="flex gap-4 bg-bg-secondary rounded-md p-4">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.value}
          onClick={() => orchestrator.getStore().getState().setLanguage(lang.value)}
          className={`px-12 py-4 text-sm rounded transition-colors ${
            language === lang.value
              ? "bg-surface-elevated text-text-primary font-medium shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
