import { ConceptsLayout } from "@/components/concepts";
import { ConceptLeafPageSkeleton } from "@/components/concepts/LoadingStates";

export function ConceptLoadingView() {
  return (
    <ConceptsLayout>
      <ConceptLeafPageSkeleton />
    </ConceptsLayout>
  );
}
