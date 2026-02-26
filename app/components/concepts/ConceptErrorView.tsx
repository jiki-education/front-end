import { ConceptsLayout } from "@/components/concepts";

interface ConceptErrorViewProps {
  message: string | null;
  onBack: () => void;
}

export function ConceptErrorView({ message, onBack }: ConceptErrorViewProps) {
  return (
    <ConceptsLayout>
      <div className="text-center">
        <div className="mb-4 text-red-600 text-lg">{message ?? "Concept not found."}</div>
        <button onClick={onBack} className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
          Back to Concepts
        </button>
      </div>
    </ConceptsLayout>
  );
}
