import { ConfirmEmailForm } from "@/components/auth/ConfirmEmailForm";
import { AuthLayout } from "@/components/ui/AuthLayout";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.confirmEmail");
  return { title: t("title"), description: t("description") };
}

export default function ConfirmEmailPage() {
  return (
    <AuthLayout>
      <Suspense>
        <ConfirmEmailForm />
      </Suspense>
    </AuthLayout>
  );
}
