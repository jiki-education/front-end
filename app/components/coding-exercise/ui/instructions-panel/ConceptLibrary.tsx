import ConceptCard from "@/components/concepts-page/ConceptCard";
import type { ConceptCardData } from "@/components/concepts-page/ConceptCard";

interface ConceptLibraryProps {
  concepts: ConceptCardData[];
  className?: string;
}

export default function ConceptLibrary({ 
  concepts, 
  className = "" 
}: ConceptLibraryProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Concept Library</h3>
      <div className="flex flex-col gap-4">
        {concepts.map((concept, index) => (
          <ConceptCard
            key={index}
            concept={concept}
            isAuthenticated={false}
          />
        ))}
      </div>
    </div>
  );
}