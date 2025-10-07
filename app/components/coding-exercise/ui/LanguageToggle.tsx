import { useOrchestrator } from "../lib/OrchestratorContext";
import { useOrchestratorStore } from "../lib/Orchestrator";

type Language = "javascript" | "python" | "jikiscript";

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
    <div className="flex gap-1 bg-gray-100 rounded-md p-1">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.value}
          onClick={() => orchestrator.getStore().getState().setLanguage(lang.value)}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            language === lang.value
              ? "bg-white text-gray-900 font-medium shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
