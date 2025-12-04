"use client";

import ConceptsListPage from "@/components/concepts/ConceptsListPage";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { useAuthStore } from "@/lib/auth/authStore";

export default function AppConceptsPage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <SidebarLayout activeItem="concepts">
      <ConceptsListPage authenticated={isAuthenticated} />
    </SidebarLayout>
  );
}
