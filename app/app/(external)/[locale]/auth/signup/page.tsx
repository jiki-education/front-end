import { SignupForm } from "@/components/auth/SignupForm";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { getAuthPanelProps, type AuthSearchParams } from "@/lib/content/getAuthPanelProps";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.signup");
  return { title: t("title"), description: t("description") };
}

export default async function SignupPage({ searchParams }: { searchParams: AuthSearchParams }) {
  const panel = await getAuthPanelProps(searchParams);
  return (
    <AuthLayout {...panel}>
      <SignupForm />
    </AuthLayout>
  );
}
