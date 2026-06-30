import { SignupForm } from "@/components/auth/SignupForm";
import { AuthLayout } from "@/components/ui/AuthLayout";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.signup");
  return { title: t("title"), description: t("description") };
}

export default function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
