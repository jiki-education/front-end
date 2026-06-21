"use client";

import { useRouter } from "next/navigation";
import { useConceptResolution } from "@/components/concepts/lib/useConceptResolution";
import { ConceptLoadingView } from "@/components/concepts/ConceptLoadingView";
import { ConceptErrorView } from "@/components/concepts/ConceptErrorView";
import { ConceptGroupView } from "@/components/concepts/ConceptGroupView";
import { ConceptLeafView } from "@/components/concepts/ConceptLeafView";
import type { ConceptDetailSeed } from "@/components/concepts/lib/useConceptDetailData";
import type { ConceptMeta, ConceptAncestor } from "@/types/concepts";

interface ConceptDetailPageProps {
  slug: string;
  initialConcept?: ConceptMeta | null;
  initialAncestors?: ConceptAncestor[];
  initialSubconcepts?: ConceptMeta[];
  initialLeafData?: ConceptDetailSeed | null;
}

export default function ConceptDetailPage({
  slug,
  initialConcept,
  initialAncestors,
  initialSubconcepts,
  initialLeafData
}: ConceptDetailPageProps) {
  const router = useRouter();
  const { concept, ancestors, isLoading, error } = useConceptResolution(slug, { initialConcept, initialAncestors });

  if (isLoading) {
    return <ConceptLoadingView />;
  }

  if (error || !concept) {
    return <ConceptErrorView message={error} onBack={() => router.push("/concepts")} />;
  }

  if (concept.category) {
    return <ConceptGroupView concept={concept} ancestors={ancestors} initialSubconcepts={initialSubconcepts} />;
  }

  return <ConceptLeafView slug={slug} initialData={initialLeafData} />;
}
