"use client";

import FolderIcon from "@/icons/folder.svg";
import { ConceptsLayout } from "@/components/concepts";
import { Breadcrumb } from "@/components/concepts";
import SubconceptsGrid from "@/components/concepts/SubconceptsGrid";
import { SignupCta } from "@/components/concepts/SignupCta";
import { useAuthStore } from "@/lib/auth/authStore";
import styles from "@/app/styles/modules/concepts.module.css";
import type { ConceptMeta, ConceptAncestor } from "@/types/concepts";

interface ConceptGroupViewProps {
  concept: ConceptMeta;
  ancestors: ConceptAncestor[];
}

export function ConceptGroupView({ concept, ancestors }: ConceptGroupViewProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <ConceptsLayout>
      <Breadcrumb conceptTitle={concept.title} ancestors={ancestors} />

      <header>
        <h1 className={styles.pageHeading}>
          <FolderIcon className={`${styles.headingIcon} w-8 h-8`} />
          {concept.title}
        </h1>
      </header>

      <SubconceptsGrid parentSlug={concept.slug} />
      {!isAuthenticated && <SignupCta />}
    </ConceptsLayout>
  );
}
