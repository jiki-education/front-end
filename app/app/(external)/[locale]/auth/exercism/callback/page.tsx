import { ExercismCallbackHandler } from "@/components/auth/ExercismCallbackHandler";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { getAuthPanelProps, type AuthSearchParams } from "@/lib/content/getAuthPanelProps";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.exercismCallback");
  return { title: t("title"), description: t("description") };
}

export default async function ExercismCallbackPage({ searchParams }: { searchParams: AuthSearchParams }) {
  const panel = await getAuthPanelProps(searchParams);
  return (
    <AuthLayout {...panel}>
      <Suspense>
        <ExercismCallbackHandler />
      </Suspense>
    </AuthLayout>
  );
}
