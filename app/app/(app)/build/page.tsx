import SidebarLayout from "../../../components/layout/SidebarLayout";
import { BuildIndex } from "./BuildIndex";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.build");
  return { title: t("title"), description: t("description") };
}

export default function BuildPage() {
  return (
    <SidebarLayout activeItem="build">
      <BuildIndex />
    </SidebarLayout>
  );
}
