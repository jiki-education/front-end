import { ResendConfirmationForm } from "@/components/auth/ResendConfirmationForm";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { getAuthPanelProps, type AuthSearchParams } from "@/lib/content/getAuthPanelProps";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.resendConfirmation");
  return { title: t("title"), description: t("description") };
}

export default async function ResendConfirmationPage({ searchParams }: { searchParams: AuthSearchParams }) {
  const panel = await getAuthPanelProps(searchParams);
  const t = await getTranslations("common");
  return (
    <AuthLayout {...panel}>
      <Suspense fallback={<div>{t("loading")}</div>}>
        <ResendConfirmationForm />
      </Suspense>
    </AuthLayout>
  );
}
