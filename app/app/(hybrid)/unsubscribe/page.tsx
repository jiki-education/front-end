import HeaderLayout from "@/components/layout/HeaderLayout";
import UnsubscribePage from "@/components/unsubscribe/UnsubscribePage";
import type { Metadata } from "next";

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
    return (
      <HeaderLayout>
        <div className="max-w-xl mx-auto px-4 py-12">
          <h1 className="text-2xl font-bold mb-4">Email Preferences</h1>
          <p className="text-red-600">Invalid link. Please use the link from your email.</p>
        </div>
      </HeaderLayout>
    );
  }

  return (
    <HeaderLayout>
      <UnsubscribePage token={token} emailKey={key} />
    </HeaderLayout>
  );
}
