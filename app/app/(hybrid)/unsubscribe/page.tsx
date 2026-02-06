import { notFound } from "next/navigation";
import HeaderLayout from "@/components/layout/HeaderLayout";
import UnsubscribePage from "@/components/unsubscribe/UnsubscribePage";
import type { Metadata } from "next";
import styles from "@/components/unsubscribe/UnsubscribePage.module.css";

export const metadata: Metadata = {
  title: "Email Preferences - Jiki",
  description: "Manage your email preferences and unsubscribe from Jiki emails."
};

interface Props {
  searchParams: Promise<{ token?: string; key?: string }>;
}

export default async function UnsubscribeRoute({ searchParams }: Props) {
  const { token, key } = await searchParams;

  if (!token) {
    notFound();
  }

  return (
    <HeaderLayout>
      <div className={styles.pageBackground}>
        <UnsubscribePage token={token} emailKey={key} />
      </div>
    </HeaderLayout>
  );
}
