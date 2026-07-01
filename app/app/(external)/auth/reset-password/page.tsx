import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.resetPassword");
  return { title: t("title"), description: t("description") };
}

export default async function ResetPasswordPage() {
  const t = await getTranslations("common");
  return (
    <Suspense fallback={<div>{t("loading")}</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
