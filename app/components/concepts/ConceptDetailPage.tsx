"use client";

import { useRouter } from "next/navigation";
import { useConceptDetailData } from "@/components/concepts/lib/useConceptDetailData";
import { ConceptLoadingView } from "@/components/concepts/ConceptLoadingView";
import { ConceptErrorView } from "@/components/concepts/ConceptErrorView";
import { ConceptGroupView } from "@/components/concepts/ConceptGroupView";
import { ConceptLeafView } from "@/components/concepts/ConceptLeafView";

interface ConceptDetailPageProps {
  slug: string;
}

export default function ConceptDetailPage({ slug }: ConceptDetailPageProps) {
  const router = useRouter();
  const data = useConceptDetailData(slug);

  if (data.isLoading) {
    return <ConceptLoadingView />;
  }

  if (data.error || !data.concept) {
    return <ConceptErrorView message={data.error} onBack={() => router.push("/concepts")} />;
  }

  if (data.concept.category) {
    return <ConceptGroupView concept={data.concept} ancestors={data.ancestors} />;
  }

  return (
    <ConceptLeafView
      concept={data.concept}
      ancestors={data.ancestors}
      content={data.content}
      isContentLoading={data.isContentLoading}
      relatedConcepts={data.relatedConcepts}
      relatedExercises={data.relatedExercises}
      videoData={data.videoData}
      isConceptUnlocked={data.isConceptUnlocked}
      getExerciseStatus={data.getExerciseStatus}
    />
  );
}
