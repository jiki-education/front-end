import { DeleteAccountConfirmContent } from "@/components/delete-account";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.deleteAccount");
  return { title: t("title"), description: t("description") };
}

export default function DeleteAccountConfirmPage() {
  return (
    <Suspense>
      <DeleteAccountConfirmContent />
    </Suspense>
  );
}
